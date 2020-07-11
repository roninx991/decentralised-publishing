const router = require('express').Router();
const passport    = require('passport');
const jwt = require('jsonwebtoken');

router.post("/login/", (req, res) => {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            console.log('Info: ' + info.message);
            return res.status(400).json({
                message: 'Something is not right',
                user   : user
            });
        }
       req.login(user, {session: false}, (err) => {
           if (err) {
               res.send(err);
           }
           // generate a signed son web token with the contents of user object and return it in the response
           const token = jwt.sign(user, process.env.JWT_SECRET);
           return res.json({token});
        });
    })(req, res);
});

module.exports = router;