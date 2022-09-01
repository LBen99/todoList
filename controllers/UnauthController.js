import bcrypt from "bcryptjs"
import mainItems from "../schemas/mainItems.js"
import fullDate from "../static/js/date.js"
class UnauthController {
    
    main(req, res) {
        res.render("pages/main", {
            items: mainItems,
            date: fullDate
        })
    }

    signup(req, res) {
        const User = req.models.User
        const {username, email} = req.body
        const password = bcrypt.hashSync(req.body.password, 10)

        User.create({username, email, password}, (err, user) => {
            if (err) {
                res.status(400).send(err)
            } else {
                res.redirect("/")
            }
        })
    }

    login(req, res) {
        const User = req.models.User
        const {username, password} = req.body

        User.findOne({username}, (err, user) => {
            if (err) {
                res.status(400).send(err)
            } else{
                if (user) {
                    const passwordCheck = bcrypt.compareSync(password, user.password)
                    if (passwordCheck) {
                        req.session.username = username
                        req.session.loggedIn = true
                        res.redirect("/todo")
                    } else {
                        res.status(400).send({error: "Incorrect password"})
                    }
                } else {
                    res.status(400).send({error: "User not found"})
                }
            }
        })
    }
    
    logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                res.status(400).send(err)
            } else {
                res.redirect("/")
            }
        })
    }
}

export default UnauthController