const web3 = require('../config/web3config');
const User = require('../models/user.model');

exports.createNewUser = (user) => {
    this.findByEmail(user.email)
        .then(user => {
            if (user) {
                return null;
            } else {
                web3.personal
                    .newAccount(user.password)
                    .then((account) => {
                        var newUser = new User(user);
                        newUser.password = newUser.setPassword(user.password);
                        newUser.firstname = user.firstname;
                        newUser.lastname = user.lastname;
                        newUser.email = user.email;
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
    return User.findOne({email: email}).then((err, user) => {
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