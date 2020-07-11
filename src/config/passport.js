const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const User = require('../models/user.model');
const crypto = require('crypto');

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, 
    async function (email, password, cb) {
        var user = await findByEmail(email);
        if (user) {
            let salt = user.password.split('$')[0];
            let hash = crypto.createHmac('sha512',salt)
                                .update(password)
                                .digest("base64");
            let pwd = salt + '$' + hash;
            if (user.password === pwd) {
                var userResponse = {
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    account: user.account,
                    papers: user.papers,
                    type: user.type
                }
                return cb(null, userResponse, {message: 'Logged in successfully.'});
            } else {
                return cb(null, false, {message: 'Incorrect password.'});
            }
        } else {
            return cb(null, false, {message: 'Incorrect email.'});
        }
    }
));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : process.env.JWT_SECRET
},
    function (jwtPayload, cb) {
        if(jwtPayload.email)
            cb(null, jwtPayload);
        cb(null, false);
    }
));

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