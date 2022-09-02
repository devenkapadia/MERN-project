require('dotenv').config()
const express = require("express");
const path = require("path")
const hbs = require("hbs")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

require("../src/db/conn")
const Register = require("./models/register")

const port = process.env.PORT || 3000

const app = express()

const templates_path = path.join(__dirname, "../templates/views")
const partials_path = path.join(__dirname, "../templates/partials")
// app.use(express.static(static_path))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.set("view engine", "hbs")
app.set("views", templates_path)
hbs.registerPartials(partials_path)

// console.log(process.env.SECRET_KEY);


app.get("/", (req, res) => {
    res.render("index")
})
app.get("/register", (req, res) => {
    res.render("register")
})
app.get("/login", (req, res) => {
    res.render("login")
})
// fetching the form data
app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if (password === cpassword) {
            const registerUser = new Register({
                name: req.body.name,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                password: password,
                confirmpassword: cpassword
            })


            const token = await registerUser.generateToken()
            const registered = await registerUser.save()
            // res.status(201).render("index")
            res.status(201).render("registered")

        } else {
            res.send("Passwords are not matching")
        }
    } catch {
        res.status(400).send(error);
    }
})

app.post("/login", async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password

        const useremail = await Register.findOne({ email: email })

        const isMatch = await bcrypt.compare(password, useremail.password)

        const token = await useremail.generateToken()
        console.log("login part",token);
        

        if (isMatch) {
            res.status(201).render("registered")
        } else {
            res.send("Password are not matching")
        }

    } catch {
        res.status(400).send("Invalid Email");
    }
})



app.listen(port, () => {
    console.log(`Server is running at ${port}`);
})