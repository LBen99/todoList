// *********************************
// *Enabling Enviromental Variables
// *********************************
import dotenv from "dotenv"
dotenv.config()

// *********************************
// *Import Dependencies
// *********************************
import express from "express"
import methodOverride from "method-override"
import morgan from "morgan"
import MainController from "./controllers/MainController.js"
import UnauthController from "./controllers/UnauthController.js"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import _ from "lodash"
import session from "express-session"
import MongoStore from "connect-mongo"

// *********************************
// *Global Variables & Controller Instantiation
// *********************************
const PORT = process.env.PORT || 3333
const MONGO_URI = process.env.MONGO_URI
const mainController = new MainController()
const unauthController = new UnauthController()

// *********************************
// *MongoDB Connection
// *********************************
mongoose.connect(MONGO_URI)

mongoose.connection
.on("open", () => console.log("Connected to Mongo"))
.on("close", () => console.log("Disonnected from Mongo"))
.on("error", (error) => console.log(error))

// *********************************
// *Model Objects
// *********************************
import Item from "./models/item.js"
import List from "./models/list.js"
import User from "./models/user.js"

// *********************************
// *Creating Application Object
// *********************************
const app = express()

// *********************************
// *Routers
// *********************************
const MainRoutes = express.Router()
const UnauthRoutes = express.Router()

// *********************************
// *Middleware
// *********************************
app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(methodOverride("_method"))
app.use("/static", express.static("static"))
app.use(morgan("tiny"))

app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({
    secret: process.env.SECRET,
    store: MongoStore.create({mongoUrl: MONGO_URI}),
    resave: false,
    saveUninitialized: true
  }));

app.use((req, res, next) => {
    req.models = {
        Item,
        List,
        User
    }
    next()
})

app.use("/", UnauthRoutes)
app.use("/", MainRoutes)

// *********************************
// *Unauthenticated Routes
// *********************************
UnauthRoutes.get("/", unauthController.main)
UnauthRoutes.post("/signup", unauthController.signup)
UnauthRoutes.post("/login", unauthController.login)
UnauthRoutes.get("/logout", unauthController.logout)

// *********************************
// *Routes that Render Pages with EJS
// *********************************
MainRoutes.get("/todo", mainController.today)
MainRoutes.post("/todo", mainController.createItem)
MainRoutes.post("/todo/createList", mainController.createList)
MainRoutes.get("/todo/:customListName/:id", mainController.findList)
MainRoutes.post("/todo/strikeItem", mainController.strikeItem)
MainRoutes.post("/todo/deleteItem", mainController.deleteItem)
MainRoutes.post("/todo/deleteList", mainController.deleteList)
MainRoutes.post("/todo/resetList", mainController.resetList)
MainRoutes.post("/my-lists", mainController.viewLists)
MainRoutes.get("/my-lists", mainController.viewLists)
MainRoutes.post("/todo/next", mainController.next)
MainRoutes.post("/todo/previous", mainController.previous)

// *********************************
// *Server Listener
// *********************************
app.listen(PORT, () => console.log(`????Listening on Port ${PORT}????`))