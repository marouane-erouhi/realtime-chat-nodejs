const mongoose = require('mongoose')
const validator = require('validator');
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail , 'Please enter a valide email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minLength: [8, 'Minimum password length is 8']
    }
});

// Hook example, runs after the `save` method is run
UserSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

// UserSchema.pre(/^findOne/, async function (next) {
//     console.log('pre')
//     console.log(this._conditions.password);
//     const salt = await bcrypt.genSalt();
//     this._conditions.password = await bcrypt.hash(this._conditions.password, salt)
//     console.log(this._conditions.password);
//     next()
// });

UserSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email })
    if(!user)   throw Error("incorrect email")
    const auth = await bcrypt.compare(password, user.password) // check password
    if(!auth)   throw Error('incorrect password')
    return user
}

module.exports = User = mongoose.model('user', UserSchema);