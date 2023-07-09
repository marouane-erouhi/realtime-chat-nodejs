const jwt = require('jsonwebtoken')
const User = require('../models/User')

const requireMiddleware = (req, res, next) => {
    const token = req.cookies.jwt

    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err) res.redirect('/login')
            else{
                // console.log('decoded token: ')
                // console.log(decoded);
                next()
            }
        })
    }else{
        res.redirect('/login')
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err){
                console.log(err)
                res.locals.user = null
                next()
            }
            else {
                console.log(decoded);
                const user = await User.findById(decoded.id)
                res.locals.user = user
                next()
            }
        })
    } else {
        res.locals.user = null
        next()
    }
}

const redirectIfLogedin = (req, res, next) => {
    const token = req.cookies.jwt

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                console.log(err)
                next()
            }
            else {
                // const user = await User.findById(decoded.id)
                res.redirect('/')
                next()
            }
        })
    } else {
        next()
    }
}

module.exports = { requireMiddleware, checkUser, redirectIfLogedin }