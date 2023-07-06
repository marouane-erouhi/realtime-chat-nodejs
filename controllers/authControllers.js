const User = require('../models/User')
const jwt = require('jsonwebtoken')

const HandleErrors = (err) => {
    const Errors = {
        email: [],
        password: [],
    }

    //bad email or pass
    if (err.message === 'incorrect email') Errors.email.push('This email is not registered')
    if (err.message === 'incorrect password') Errors.password.push('Password incorrect')

    // User already exists
    if (err.code == 11000) {
        Errors.email.push('Email already in use')
        return Errors
    }

    // Validation errors
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({ properties }) => {
            Errors[properties.path].push(properties.message)
        })
    }

    return Errors
}

const maxAge = 3 * 24 * 60 * 60 //3 days in secconds
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
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

    try{
        const user = await User.login(email, password)
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(201).json({ user: user._id })
    }catch(err){
        const errors = HandleErrors(err)
        res.status(400).json({ errors })
    }

    next()
}