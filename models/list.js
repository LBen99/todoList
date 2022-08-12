import mongoose from "mongoose"

const listSchema = new mongoose.Schema({
  name: String,
  items: [{type: String, name: String}] 
}, {typeKey: "$type"})

const List = mongoose.model("List", listSchema)
export default List
