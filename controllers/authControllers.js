const UserModel = require('../schemas/userSchema')

module.exports.signup_get = (req, res) => {
    res.render('signup')
}

module.exports.signup_post = (req, res) => {

    // req.body
    console.log(req.body)

    UserModel.findOne({ username: req.username })
        .then(user => {
            if (user) {
                console.log('User found:', user);
                // return error, user already exists
                res.send('user already exists')
            } else {
                // create user
                const newUser = new UserModel({ username: req.username, password: req.password });
                newUser.save()
                    .then(savedUser => {
                        console.log("savedUser: " + savedUser)
                    })
                    .catch(err => {
                        console.log("error while saving user: " + err)
                    })
                res.send('user registred')
            }
        })
        .catch(error => {
            console.error(error);
        });

}

module.exports.signin_get = (req, res) => {
    res.render('signin')
}

module.exports.signin_post = (req, res) => {
    res.send("new signin")
}