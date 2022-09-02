const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const registerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    gender: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirmpassword: {
        type: String,
        required: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]

})

registerSchema.methods.generateToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY)
        console.log(token);
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        console.log(this.token);
        
        return token;

    } catch (error) {
        console.log("hello");
        
        console.log(error);
        console.log("hello");
        
    }
}

registerSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        console.log(`the current pw is ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10)
        console.log(`the current pw is ${this.password}`);

        this.confirmpassword = await bcrypt.hash(this.password, 10)
    }
    next()
})

// Creating a new collection
const Register = new mongoose.model("Register", registerSchema)

module.exports = Register;
