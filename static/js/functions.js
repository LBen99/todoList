import List from "../../models/list.js"

//Get list id
function getListId(listName) {
    const queryId = List
    .find({ name: listName })
    return queryId
}

//Get list items
function getItems(id) {
    const queryItems = List
    .findById(id)
    .select("items")
    return queryItems
}

//Get all lists
function getListNames() {
    const queryNames = List
    .find()
    .sort("name")
    .select("name")
    return queryNames
  }

//Get next and previous lists
function getFirstName() {
    const queryFirst = List
    .findOne()
    .sort({name: 1})
    return queryFirst
}
function getNextName(name) {
    const queryNext = List
    .findOne({name: {$gt: name}})
    .sort({name: 1})
    return queryNext
}
  
function getLastName() {
    const queryLast = List
    .findOne()
    .sort({name: -1})
    return queryLast
}
  
function getPreviousName(name) {
    const queryPrevious = List
    .findOne({name: {$lt: name}})
    .sort({name: -1})
    return queryPrevious
}

export {
    getListId,
    getItems,
    getListNames,
    getFirstName,
    getNextName,
    getLastName,
    getPreviousName
}
  