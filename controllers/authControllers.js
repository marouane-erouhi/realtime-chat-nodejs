const User = require('../models/User')

module.exports.signup_get = async (req, res, next) => {
    res.render('signup')
}

const HandleErrors = (err) => {
    const Errors = {
        email: [],
        password: [],
    }

    // User already exists
    if(err.code == 11000){
        Errors.email.push('Email already in use')
        return Errors
    }

    // Validation errors
    Object.values(err.errors).forEach(({ properties }) => {
        Errors[properties.path].push(properties.message)
    })
    return Errors
}
module.exports.signup_post = async (req, res, next) => {
    const {email, password} = req.body
    try{
        // create user
        await User.create({ email: email, password: password })
    }catch (err){
        const errors = HandleErrors(err)
        // console.log(errors);
        res.status(400).json(errors)
        next()
        return
    }

    res.status(400).send(`user ${email} registred`)
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