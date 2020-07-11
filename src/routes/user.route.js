const router = require('express').Router();

const UserService = require('../services/user.service');

router.post("/", async (req, res) => {
    var user = await UserService.createNewUser(req.body);
    if (user) {
        res.status(200).json({code: "success", msg: "Account created successfully. Please login to continue."});
    } else {
        res.status(400).json({code: "error", msg: "Failed to create account using given details. Try again after some time or with a different email"});
    }
});

module.exports = router;