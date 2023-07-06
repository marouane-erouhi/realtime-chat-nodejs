const User = require('../models/User')
const jwt = require('jsonwebtoken')

const HandleErrors = (err) => {
    const Errors = {
        email: [],
        password: [],
    }

    // User already exists
    if (err.code == 11000) {
        Errors.email.push('Email already in use')
        return Errors
    }

    // Validation errors
    Object.values(err.errors).forEach(({ properties }) => {
        Errors[properties.path].push(properties.message)
    })
    return Errors
}

const maxAge = 3 * 24 * 60 * 60 //3 days in secconds
const createToken = (id) => {
    return jwt.sign({id}, 'secret secret, hehe', {
        expiresIn: maxAge
    })
}

module.exports.signup_get = async (req, res, next) => {
    res.render('signup')
}

module.exports.signup_post = async (req, res, next) => {
    const {email, password} = req.body
    try{
        // create user
        const user = await User.create({ email: email, password: password })
        const token = createToken(user._id)
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
        res.status(201).json({ user: user._id })
    } catch (err) {
        const errors = HandleErrors(err)
        // console.log(errors);
        res.status(400).json({errors})
        next()
        return
    }

}

module.exports.login_get = async (req, res, next) => {
    res.render('login')
}

module.exports.login_post = async (req, res, next) => {
    const { email, password } = req.body
    const existingUser = await User.findOne({ email: email, password: password })

    // check if 
    if (existingUser) {
        res.send(`Wencome back ${email}`)
        next()
        return
    }

    res.send("Wrong credentials, try again")
    next()
}