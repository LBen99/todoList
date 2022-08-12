import _ from "lodash"
import * as userCollection from "../static/js/functions.js"
import {defaultItems} from "../models/item.js"

class MainController {
    
    index(req, res) {
        res.render("pages/main")
    }
//! remove delete list button from today list or insert today list into list schema
    today(req, res) {
        const Item = req.models.Item

        Item.find({}, function(err, foundItems) {
            if (foundItems.length === 0) {
              Item.insertMany(defaultItems, function(err) {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Successfully Saved defaultItems to DB");
                };
              });
              res.redirect("/todo");
            } else {
              res.render("pages/today", {
                listTitle: "Today",
                newListItems: foundItems,
                id: req.params.id
              });
            }
          });
    }

    createItem(req, res) {
        const Item  = req.models.Item
        const List = req.models.List
        const itemName = req.body.newItem
        const listName = _.lowerCase(req.body.list)
        const id = req.body.listId
       
        console.log(id)

        const newItem = new Item({
            name: itemName
        })
        // const item = new List({
        //     items: itemName
        // })

        // Add item to  default list
        if (listName === "today") {
            newItem.save(() => res.redirect("/todo"))
          } else {
            // Add item to custom list
            List.update(
                {name: listName}, 
                {
                    $push: {
                        items: newItem
                    }
                }
            )
            .then(() => res.redirect("/todo/" + listName + "/" + id))
            //     (err, lists) => {
            //     List.items.push(newItem)
            //     lists.save(() => res.redirect("/todo/" + listName + "/" + lists.id));
            // })
        }
    }

    createList(req, res) {
        const List = req.models.List
        const newListName = _.lowerCase(req.body.newListName)

        List
        .findOne({name: newListName})
        .exec(function(err, lists) {
            if (!err) {
                if (!lists) {
                    const list = new List({
                    name: newListName,
                    items: defaultItems
                    })
                    // list.save(() => res.redirect("/todo/" + list.name))
                    list.save(() => res.redirect("/todo/"+ list.name + "/" + list.id))
                } else {
                    res.render("pages/list", {
                        listTitle: _.capitalize(lists.name),
                        newListItems: lists,
                        id: lists.id
                        })                                        
                }
            }
        })
    }

    findList(req, res) {

        const id = req.params.id
        const List = req.models.List
        const customListName = _.lowerCase(req.params.customListName)

        // Find list by url or create new list if not found
        List.findOne({
            _id: id,
            name: customListName
        }, (err, foundList) => {
            if (err) {
                console.log(err)
                res.status(400).send(err)
            } else {

                if (customListName !== "my-lists") {

                    if (!foundList) {
                        // console.log(listName)
                        const list = new List({
                            name: customListName,
                            items: defaultItems
                        })
                        list.save(() => res.redirect("/todo/" + _.capitalize(customListName) + "/" + id))
                        // list.save(() => res.redirect("/todo/" + "/" + id))

                        } else {

                        
                        res.render("pages/list", {
                            listTitle: _.capitalize(foundList.name),
                            newListItems: foundList.items,
                            id: foundList.id
                        })
                    }
                } 
            }
        })
    }

    deleteItem(req, res) {
        const id = req.body.thisListId
        const Item = req.models.Item
        const List = req.models.List
        const checkedItemId = req.body.checkbox
        const listName = req.body.thisList

        // console.log(listName)
        console.log(checkedItemId)
        // console.log(listId)

        // Delete item from default list
        if (listName === "Today") {
            Item.findByIdAndRemove(checkedItemId, function(err) {
            if (!err) {
                res.redirect("/todo")
            }
            })
        } else {
            // Delete item from custom list
            List.findOneAndUpdate(
            listName,
            {$pull: 
                {items: 
                    {_id: checkedItemId}
                }
            }, (err) => {
                if (!err) {
                    res.redirect("/todo/" + listName + "/" + id)
                } else {
                    console.log(err)
                }
            })

            
            
        }
    }

    deleteList(req, res) {
        const List = req.models.List
        const id = req.body.deleteButton
        console.log(id)
        List.findByIdAndDelete(id, function(err) {
            if (!err) {
            res.redirect("/todo")
            }
        })
    }
//! Capitalize list names
    viewLists(req, res) {
        const currentList = req.body.currentList
        const queryNames = userCollection.getListNames()

        queryNames
        .exec(function(err, lists) {
            if (!err) {
            const names = lists
            res.render("pages/viewCollection", {
                listTitle: _.capitalize(currentList),
                listNames: names,
                id: names.id
                })
            }
        })
    }

    next(req, res) {
        const listName = _.lowerCase(req.body.nextList)

        const queryFirst = userCollection.getFirstName()
        const queryNext = userCollection.getNextName(listName)
        const queryLast = userCollection.getLastName()
      
        let lastName = queryLast
        .exec(function(err, list) {
            if (err) {
                console.log(err)
            } else {
                lastName = list.name
                return lastName
                }
            })
      
        if (listName === "today") {
            // const id = req.params.id
      
        queryFirst
        .exec(function(err, list) {
            if (err) {
                return console.log("err")
            } else {
                // res.redirect("/todo/" + list.name)
                res.redirect("/todo/" + list.name + "/" + list.id)
                }
            })

        } else {
      
        queryNext
        .exec(function(err, list) {
            if (listName === lastName) {
              res.redirect("/todo")
            } else {
                // res.redirect("/todo/" + list.name)
                res.redirect("/todo/" + list.name + "/" + list.id)
                }
            })
        } 
    }

    previous(req, res) {
        const listName = _.lowerCase(req.body.previousList)

        const queryLast = userCollection.getLastName()
        const queryPrevious = userCollection.getPreviousName(listName)
        const queryFirst = userCollection.getFirstName()

        let firstName = queryFirst
        .exec(function(err, list) {
            if (err) {
            console.log(err)
            } else {
            firstName = list.name
            return firstName
            }
        })

        if (listName === "today") {
            queryLast
            .exec(function(err, list) {
            if (err) {
                return console.log("err")
            } else {
                // res.redirect("/todo/" + list.name)
                res.redirect("/todo/" + list.name + "/" + list.id)
                }
            })
        } else {
            queryPrevious
            .exec(function(err, list) {
            if (listName === firstName) {
                res.redirect("/todo")
            } else {
                // res.redirect("/todo/" + list.name)
                res.redirect("/todo/" + list.name + "/" + list.id)
                }
            })
        }
    }
}

export default MainController