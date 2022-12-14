import _ from "lodash"
import * as userCollection from "../static/js/functions.js"
import {newList} from "../models/list.js"
import defaultItems from "../schemas/defaultItems.js"
import fullDate from "../static/js/date.js"
class MainController {

    today(req, res) {
        const List = req.models.List
        const username = req.session.username
        const queryList = userCollection.getList(username, "today")
        const queryNames = userCollection.getListNames(username)
        
        queryList.exec((err, foundList) => {
            if (!err) {
                queryNames.exec((err, foundAllLists) => {
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
                                date: fullDate,
                                allLists: foundAllLists
                            })
                        }
                    }
                })
            }
        })
    }

    createItem(req, res) {
        const Item  = req.models.Item
        const List = req.models.List
        const itemName = req.body.newItem
        const listName = _.lowerCase(req.body.saveList)
        const id = req.body.saveListId
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
        const queryNames = userCollection.getListNames(username)
        const id = req.params.id

        queryList.exec((err, aggList) => {
            if (!err) {
                queryNames.exec((err, foundAllLists) => {
                    if (!err) {
                        if (customListName !== "today") {
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
                                            queryNames.exec((err, foundAllLists) => {
                                                if (!err) {
                                                    res.render("pages/list", {
                                                        listTitle: _.capitalize(customListName),
                                                        lists: aggList,
                                                        date: fullDate,
                                                        listId: id,
                                                        allLists: foundAllLists
                                                    })                       
                                                }
                                            })
                                        }
                                    })
                                })
                            }
                            res.render("pages/list", {
                                listTitle: _.capitalize(customListName),
                                lists: aggList,
                                date: fullDate,
                                listId: id,
                                allLists: foundAllLists
                            })
                        } else {
                            res.redirect("/todo")
                        }
                    }
                })
            }
        })
    }

    strikeItem(req, res) {
        const List = req.models.List
        const username = req.session.username
        const listId = req.body.thisListId
        const listName = _.lowerCase(req.body.thisList)
        const taskId = req.body.thisTaskId
        const strikedTask = req.body.strikedTask

        if (strikedTask === "false") {
            List.updateOne(
                {
                    username: username,
                    "lists.name": listName
                },
                {
                    $set: {
                        "lists.$.items.$[item].strike": true
                    }
                },
                {
                    arrayFilters: [{"item._id": taskId}]
                }
            ).exec(res.redirect("/todo/" + listName + "/" + listId))
        } else if (strikedTask === "true") {
            List.updateOne(
                {
                    username: username,
                    "lists.name": listName
                },
                {
                    $set: {
                        "lists.$.items.$[item].strike": false
                    }
                },
                {
                    arrayFilters: [{"item._id": taskId}]
                }
            ).exec(res.redirect("/todo/" + listName + "/" + listId))
        }
    }

    deleteItem(req, res) {
        const id = req.body.thisListId
        const List = req.models.List
        const deleteItemId = req.body.deleteItemButton
        const listName = _.lowerCase(req.body.thisList)
        const username = req.session.username

        console.log(deleteItemId)

        List.updateOne(
            {
                username: username,
                "lists.name": listName
            },
            {
               $pull: {
                    "lists.$.items": {
                        _id: deleteItemId
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
        const listName = _.lowerCase(req.body.deleteButton)

        console.log(listName)

        List.updateOne(
            {
                username: username,   
            },
            {
               $pull: {
                    lists: {
                        name: listName
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

    resetList(req, res) {
        const List = req.models.List
        const username = req.session.username
        const listName = _.lowerCase(req.body.resetList)
        const listId = req.body.resetListId

        if (listName === "today") {
            List.updateOne(
                {
                    username: username,
                    "lists.name": "today"
                },
                {
                    $pull: {
                        "lists.$.items": {}
                    }
                }
            ).exec(() => {
                List.updateOne(
                    {
                        username: username,
                        "lists.name": "today"
                    },
                    {
                        $push: {
                            "lists.$.items": defaultItems
                        }
                    }
                ).exec(res.redirect("/todo"))
            })
        } else {
            List.updateOne(
                {
                    username: username,
                    "lists.name": listName
                },
                {
                    $pull: {
                        "lists.$.items": {}
                    }
                }
            ).exec(() => {
                List.updateOne(
                    {
                        username: username,
                        "lists.name": listName
                    },
                    {
                        $push: {
                            "lists.$.items": defaultItems
                        }
                    }
                ).exec(res.redirect("/todo/" + listName + "/" + listId))
            })
        }    
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