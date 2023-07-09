const mongoose = require('mongoose')
const validator = require('validator');
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please enter a username'],
        unique: [true, 'Username is take, try a diffrent one'],
        lowercase: true,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail , 'Please enter a valid email address']
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

UserSchema.statics.login = async function(email, password, username) {
    // const user = await this.findOne({ username })
    const user = await this.findOne({ $or: [{ username }, { email }] });
    if (!user) throw Error("user not found")
    const auth = await bcrypt.compare(password, user.password) // check password
    if(!auth)   throw Error('incorrect password')
    return user
}

module.exports = User = mongoose.model('user', UserSchema);