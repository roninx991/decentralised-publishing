const mongoose = require('../config/database');
const crypto = require('crypto');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    permissionLevel: {
        type: String,
        required: true,
        default: 0
    },
    account: {
        type: String,
        required: true
    }
});

UserSchema.methods.setPassword = (password) => {
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512',salt)
                                     .update(password)
                                     .digest("base64");
    return salt + "$" + hash;
}

module.exports = mongoose.model('User', UserSchema);