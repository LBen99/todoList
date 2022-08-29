import _ from "lodash"
import * as userCollection from "../static/js/functions.js"
import {newList} from "../models/list.js"
import defaultItems from "../schemas/defaultItems.js"
import fullDate from "../static/js/date.js"
class MainController {
    
    index(req, res) {
        res.render("pages/main")
    }

    today(req, res) {
        const List = req.models.List
        const username = req.session.username
        const queryList = userCollection.getList(username, "today")
        
        queryList.exec((err, foundList) => {
            if (!err) {
                if (!foundList[0]) {
                    const list = new List({
                        username: username,
                        lists: {name: "today", items: defaultItems}
                    })
                    list.save(() => res.redirect("/todo"))
                } else {
                    res.render("pages/today", {
                        listTitle: "Today",
                        lists: foundList,
                        listId: foundList._id,
                        date: fullDate
                    })
                }
            }
        })
    }

    createItem(req, res) {
        const Item  = req.models.Item
        const List = req.models.List
        const itemName = req.body.newItem
        const listName = _.lowerCase(req.body.list)
        const id = req.params.id
        const username = req.session.username
       
        const newItem = new Item({
            name: itemName               
        })

        List.updateOne(
            {
                username: username,
                "lists.name": listName
            },
            {
               $push: {
                    "lists.$.items": newItem
               } 
            }
        )
        .exec((err) => {
            if (err) {
                console.log(err)
            } else {
                if (listName === "today") {
                    res.redirect("/todo")
                } else {
                    console.log(listName, id)
                    res.redirect("/todo/" + listName + "/" + id)
                }
            }
        })
    }

    createList(req, res) {
        const List = req.models.List
        const username = req.session.username
        const listName = _.lowerCase(req.body.newListName)
        const queryName = userCollection.getOneName(username, listName)        

        queryName
        .exec((err, foundList) => {
            if (err) {
                console.log(err)
                res.status(400).send(err)
            } else {
                if (foundList[0]) {
                    res.redirect("/todo/" + foundList[0].name + "/" + foundList[0]._id)                                           
                } else {
                    const list = new newList({
                        name: listName, 
                        items: defaultItems
                    })
                    List.updateOne(
                        {
                            username: username
                        },
                        {
                            $push: {
                                lists: list
                            }
                        }
                    )
                    .exec((err) => {
                        if (err) {
                            console.log(err)
                        } 
                    })
                    res.redirect("/todo/" + list.name + "/" + list._id)
                }
            }
        })
    }

    findList(req, res) {
        const List = req.models.List
        const username = req.session.username
        const customListName = req.params.customListName
        const queryList = userCollection.getList(username, customListName)

        queryList
        .exec((err, aggList) => {
            if (!err) {
                if (!aggList) {
                    const list = new newList({
                        name: customListName, 
                        items: defaultItems
                    })
                    List.updateOne(
                        {
                            username: username
                        },
                        {
                            $push: {
                                lists: list
                            }
                        }
                    )
                    .exec(() => {
                        queryList.exec((err, aggList) => {
                            if (!err) {
                                res.render("pages/list", {
                                    listTitle: _.capitalize(customListName),
                                    lists: aggList,
                                    id: aggList._id
                                })                       
                            }
                        })
                    })
                }
                res.render("pages/list", {
                    listTitle: _.capitalize(customListName),
                    lists: aggList,
                    id: aggList._id
                })
            }
        })
    }

    deleteItem(req, res) {
        const id = req.body.thisListId
        const List = req.models.List
        const checkedItemId = req.body.checkbox
        const listName = _.lowerCase(req.body.thisList)
        const username = req.session.username

        List.updateOne(
            {
                username: username,
                "lists.name": listName
            },
            {
               $pull: {
                    "lists.$.items": {
                        _id: checkedItemId
                    }
               } 
            }
        )
        .exec((err) => {
            if (err) {
                console.log(err)
            } else {
                if (listName === "today") {
                    res.redirect("/todo")
                } else {
                    res.redirect("/todo/" + listName + "/" + id)
                }
            }
        })
    }

    deleteList(req, res) {
        const List = req.models.List
        const username = req.session.username
        const name = req.body.listName

        List.updateOne(
            {
                username: username,
            },
            {
               $pull: {
                    "lists": {
                        name: name
                    }
               } 
            }
        )
        .exec((err) => {
            if (err) {
                console.log(err)
            } else {
                res.redirect("/todo")
            }
        })
    }

    viewLists(req, res) {
        const currentList = req.body.currentList
        const username = req.session.username
        const queryNames = userCollection.getListNames(username)

        queryNames.exec(function(err, foundLists) {
            if (!err) {
            res.render("pages/viewCollection", {
                listTitle: "My Lists",
                lists: foundLists
                })
            }
        })
    }

    next(req, res) {
        const listName = _.lowerCase(req.body.nextList)
        const username = req.session.username
        const queryFirst = userCollection.getFirstName(username)
        const queryNext = userCollection.getNextName(username, listName)
        const queryLast = userCollection.getLastName(username)

        queryNext.exec((err, nextList) => {
            if (!err) {
                queryLast.exec((err, lastList) => {
                    if (!err) {
                        queryFirst.exec((err, firstList) => {
                            if (!err) {
                                if (listName === lastList[0].name) {
                                    res.redirect("/todo/" + firstList[0].name + "/" + firstList[0]._id)
                                } else {
                                    if (nextList[0].name === "today") {
                                        res.redirect("/todo")
                                    } else {
                                        res.redirect("/todo/" + nextList[0].name + "/" + nextList[0]._id)
                                    }
                                }
                            }
                        })
                    }
                })
            }
        })
    }

    previous(req, res) {
        const listName = _.lowerCase(req.body.previousList)
        const username = req.session.username
        const queryLast = userCollection.getLastName(username)
        const queryPrevious = userCollection.getPreviousName(username, listName)
        const queryFirst = userCollection.getFirstName(username)

        queryPrevious.exec((err, previousList) => {
            if (!err) {
                queryLast.exec((err, lastList) => {
                    if (!err) {
                        queryFirst.exec((err, firstList) => {
                            if (!err) {
                                if (listName === firstList[0].name) {
                                    res.redirect("/todo/" + lastList[0].name + "/" + lastList[0]._id)
                                } else {
                                    if (previousList[0].name === "today") {
                                        res.redirect("/todo")
                                    } else {
                                        res.redirect("/todo/" + previousList[0].name + "/" + previousList[0]._id)
                                    }
                                }
                            }
                        })
                    }
                })
            }
        })
    }
}

export default MainController