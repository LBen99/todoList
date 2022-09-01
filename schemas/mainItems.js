import Item from "../models/item.js"

const item1 = new Item({
    name: "Keep track of tasks you need to complete"
})

const item2 = new Item({
    name: "Organise tasks within seperate lists"
})

const item3 = new Item({
    name: "Sign up to create your own!"
})

const mainItems = [item1, item2, item3]

export default mainItems