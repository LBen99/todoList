import List from "../../models/list.js"
//Get list
function getList(username, listName) {
    const queryList = List
    .aggregate([
        {
            $match: {
                username: username
            }
        },
        {
            $unwind: {
                path: "$lists"
            }
        },
        {
            $match: {
                "lists.name": listName
            }
        },
        {
            $unwind: {
                path: "$lists.items"
            }
        },
        {
            $project: {
                _id: "$lists._id",
                name: "$lists.name",
                items: "$lists.items"
            }
        }
    ])
    return queryList
}

function getOneName(username, listName) {
    const queryName = List
    .aggregate([
        {
            $match: {
                username: username
            }
        },
        {
            $unwind: {
                path: "$lists"
            }
        },
        {
            $project: {
                _id: "$lists._id",
                name: "$lists.name"
            }
        },
        {
            $match: {
                name: listName
            }
        }
    ])
    return queryName
}

//Get all lists
function getListNames(username) {
    const queryNames = List
    .aggregate([
        {
            $match: {
                username: username
            }
        },
        {
            $unwind: {
                path: "$lists"
            }
        },
        {
            $project: {
                _id: "$lists._id",
                name: "$lists.name"
            }
        },
        {
            $sort: {
                name: 1
            }
        }
    ])
    return queryNames
  }

//Get next and previous lists
function getFirstName(username) {
    const queryFirst = List
    .aggregate([
        {
            $match: {
                username: username
            }
        },
        {
            $unwind: {
                path: "$lists"
            }
        },
        {
            $project: {
                name: "$lists.name"
            }
        },
        {
            $sort: {
                name: 1
            }
        },
        {
            $limit: 1
        }
    ])
    return queryFirst
}
function getNextName(username, listName) {
    const queryNext = List
    .aggregate([
        {
            $match: {
                username: username
            }
        },
        {
            $unwind: {
                path: "$lists"
            }
        },
        {
            $project: {
                _id: "$lists._id",
                name: "$lists.name"
            }
        },
        {
            $sort: {
                name: 1
            }
        },
        {
            $match: {
                name: {
                    $gt: listName
                }
            }
        },
        {
            $limit: 1
        }
    ])
    return queryNext
}
  
function getLastName(username) {
    const queryLast = List
    .aggregate([
        {
            $match: {
                username: username
            }
        },
        {
            $unwind: {
                path: "$lists"
            }
        },
        {
            $project: {
                name: "$lists.name"
            }
        },
        {
            $sort: {
                name: -1
            }
        },
        {
            $limit: 1
        }
    ])
    return queryLast
}
  
function getPreviousName(username, listName) {
    const queryPrevious = List
    .aggregate([
        {
            $match: {
                username: username
            }
        },
        {
            $unwind: {
                path: "$lists"
            }
        },
        {
            $project: {
                _id: "$lists._id",
                name: "$lists.name"
            }
        },
        {
            $sort: {
                name: -1
            }
        },
        {
            $match: {
                name: {
                    $lt: listName
                }
            }
        },
        {
            $limit: 1
        }
    ])
    return queryPrevious
}

export {
    getList,
    getOneName,
    getListNames,
    getFirstName,
    getNextName,
    getLastName,
    getPreviousName
}
  