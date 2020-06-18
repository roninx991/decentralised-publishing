const Web3 = require('web3');
const User = require('../models/user.model');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

exports.createNewUser = (user) => {
    this.findByEmail(user.email)
        .then(existingUser => {
            if (existingUser) {
                return null;
            } else {
                return  web3.eth.personal.newAccount(user.password).then(async (account) => {
                        var newUser = new User(user);
                        console.log(newUser);
                        newUser.password = newUser.setPassword(user.password);
                        newUser.firstname = user.firstname;
                        newUser.lastname = user.lastname;
                        newUser.email = user.email;
                        newUser.account = account;
                        newUser.save();
                        return { id: newUser._id, account: account};    
                    }).catch((err) => {
                        console.log("Error in creating account in geth.");
                        console.log(err);
                    });
            }
        }).catch((err) => {
            console.log("Error in creating new user.");
            console.log(err);
        });
}

exports.findByEmail = (email) => {
    return User.findOne({email: email}).then((user) => {
        if (!user) {
            console.log("No such user exists with email: ", email);
            return null;
        } 
        return user;
    }).catch((err) => {
        console.log("Error finding user: ", email);
        console.log(err);
        return null;
    });
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