import Item from "../models/item.js"

const item1 = new Item({
    name: "Welcome to your to-do list!"
})
const item2 = new Item({
    name: "Hit the + button to add a new item."
})
const item3 = new Item({
    name: "<-- Hit this to delete an item."
    })

const defaultItems = [item1, item2, item3]

export default defaultItems