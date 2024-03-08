const {Schema, model} = require('mongoose')


const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    dob: {
        type: Number,
        required: true
    },
}, {timestamps: true})

const userModel = model('user', userSchema)

module.exports = userModel