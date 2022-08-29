import mongoose from "mongoose"

const listSchema = new mongoose.Schema({
  username: {type: String, unique: true},
  lists: [{name: String, items: [{name: String}]}]
})

const newListSchema = new mongoose.Schema({
  name: String,
  items: [{name: String}]
})

const List = mongoose.model("List", listSchema)
const newList = mongoose.model("newList", newListSchema)
export {newList}
export default List