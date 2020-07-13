const router = require('express').Router();
const passport    = require('passport');
const jwt = require('jsonwebtoken');

const UserService = require('../services/user.service');

router.post("/login/", (req, res) => {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            console.log('Info: ' + info.message);
            return res.status(400).json({
                message: 'Something is not right',
                user   : user
            });
        }
        var payload = {
            account: user.account,
            email: user.email,
            type: user.type,
            firstname: user.firstname,
            lastname: user.lastname,
        }
        req.login(user, {session: false}, (err) => {
           if (err) {
               res.send(err);
           }
           // generate a signed son web token with the contents of user object and return it in the response
           const token = jwt.sign(payload, process.env.JWT_SECRET);
           return res.json({token});
        });
    })(req, res);
});

router.post("/register", async (req, res) => {
    var user = await UserService.createNewUser(req.body);
    if (user) {
        res.status(200).json({code: "success", msg: "Account created successfully. Please login to continue."});
    } else {
        res.status(400).json({code: "error", msg: "Failed to create account using given details. Try again after some time or with a different email"});
    }
});

module.exports = router;