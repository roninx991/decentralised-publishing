const Web3 = require('web3');
const User = require('../models/user.model');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

exports.createNewUser = async (user) => {
    var userExists = await userExistsAlready(user);
    if(userExists) {
        console.log("User already exists!");
        return null;
    } else {
        try {
            const account = await web3.eth.personal.newAccount(user.password);
            const newUser = await saveUser(user, account);
            return Promise.resolve(newUser);    
        } catch (err) {
            console.log(err);
            return null;
        }
    }
}

exports.updateUser = (email, perm_lvl) => {
    this.findByEmail(email).then((user) => {
        if (user) {
            user.permissionLevel = 1;
            user.save();
            return user._id;
        } else {
            console.log("No such user exists with email: ", email);
            return null;
        }
    }).catch((err) => {
        console.log("Error finding user: ", email);
        console.log(err);
        return null;
    })
}

function saveUser(user, account) {
    var newUser = new User(user);
    newUser.password = newUser.setPassword(user.password);
    newUser.firstname = user.firstname;
    newUser.lastname = user.lastname;
    newUser.email = user.email;
    newUser.account = account;
    return newUser
        .save()
        .then(() => {
            return Promise.resolve(newUser);
        })
        .catch((err) => {
            console.log(err.Error);
            return null;
        });
    
}

async function userExistsAlready(user) {
    const existingUser = await findByEmail(user.email);
    if(existingUser) {
        return Promise.resolve(true);
    }
    return Promise.resolve(false);
}

function findByEmail(email) {
    return User.findOne({email: email}).then((user) => {
        if (!user) {
            return null;
        } 
        return user;
    }).catch((err) => {
        console.log("Error finding user: ", email);
        console.log(err);
        return null;
    });
}