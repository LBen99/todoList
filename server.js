// *********************************
// Enabling Enviromental Variables
// *********************************
import dotenv from "dotenv"
dotenv.config()

// *********************************
// Import Dependencies
// *********************************
import express from "express"
import methodOverride from "method-override"
import cors from "cors"
import morgan from "morgan"
import MainController from "./controllers/MainController.js"
import APIController from "./controllers/APIController.js"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import _ from "lodash"

// *********************************
// Global Variables & Controller Instantiation
// *********************************
const PORT = process.env.PORT || 3333
const MONGO_URI = process.env.MONGO_URI

const mainController = new MainController()
const apiController = new APIController()

// *********************************
// MongoDB Connection
// *********************************
mongoose.connect(MONGO_URI)

mongoose.connection
.on("open", () => console.log("Connected to Mongo"))
.on("close", () => console.log("Disonnected from Mongo"))
.on("error", (error) => console.log(error))

// *********************************
// Todo Model Object
// *********************************
import Item from "./models/item.js"
import List from "./models/list.js"

// *********************************
// Creating Application Object
// *********************************
const app = express()

// *********************************
// Routers
// *********************************
const MainRoutes = express.Router()
const APIRoutes = express.Router()

// *********************************
// Middleware
// *********************************
// Global Middleware
app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(methodOverride("_method"))
app.use("/static", express.static("static"))
app.use(morgan("tiny"))

app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, res, next) => {
    req.models = {
        Item,
        List
    }
    next()
})

app.use("/", MainRoutes)
app.use("/api", APIRoutes)
// Router Specific Middleware
APIRoutes.use(cors())

// *********************************
// Routes that Render Pages with EJS
// *********************************
// MainRoutes.get("/", mainController.index)
MainRoutes.get("/todo", mainController.today)
MainRoutes.post("/todo", mainController.createItem)
MainRoutes.post("/my-lists/createList", mainController.createList)
// MainRoutes.get("/todo/:customListName", mainController.findList)
MainRoutes.get("/todo/:customListName/:id", mainController.findList)
// MainRoutes.get("/todo/:id", mainController.findList)
MainRoutes.post("/todo/deleteItem", mainController.deleteItem)
MainRoutes.post("/todo/deleteList", mainController.deleteList)
MainRoutes.post("/my-lists", mainController.viewLists)
MainRoutes.get("/my-lists", mainController.viewLists)
MainRoutes.post("/todo/next", mainController.next)
MainRoutes.post("/todo/previous", mainController.previous)

// *********************************
// API Routes that Return JSON
// *********************************
APIRoutes.get("/", apiController.example) //"/api"

// *********************************
// Server Listener
// *********************************
app.listen(PORT, () => console.log(`👂Listening on Port ${PORT}👂`))