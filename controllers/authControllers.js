const User = require('../models/User')
const jwt = require('jsonwebtoken')

const HandleErrors = (err) => {
    const Errors = {
        email: [],
        username: [],
        password: [],
    }

    //bad email or pass
    if (err.message === 'user not found') Errors.email.push('This user those not exist')
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
    res.render('signup', {
        title: 'Signup'
    })
}

module.exports.signup_post = async (req, res, next) => {
    const {email, username, password} = req.body

    try{
        // create user
        let user
        if (email === '') {
            user = await User.create({ username, password })
        }else{
            user = await User.create({ username, email, password })
        }
        
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.cookie('username', user.username, { maxAge: maxAge * 1000 })
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
    res.render('login', {
        title: 'Login'
    })
}

module.exports.login_post = async (req, res, next) => {
    const { email, username, password } = req.body

    try{
        const user = await User.login(email, password, username)
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.cookie('username', user.username, { maxAge: maxAge * 1000 })
        res.status(201).json({ user: user._id })
    }catch(err){
        const errors = HandleErrors(err)
        res.status(400).json({ errors })
    }

    next()
}

module.exports.logout_get = async (req, res, next) => {
    res.cookie('jwt', '', { maxAge: 1 })
    res.cookie('username', '', { maxAge: 1 })
    res.redirect('/')
}