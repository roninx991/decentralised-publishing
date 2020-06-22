const router = require('express').Router();

const UserService = require('../services/user.service');

router.get("/:id", (req, res) => {
    UserService.findByEmail(req.params.id).then((user) => {
        if (user) {
            res.status(200).json(user);
        } else {
            res.sendStatus(404);
        }
    }).catch((err) => {
        console.log(err);
        res.sendStatus(500);
    });
});

router.post("/", async (req, res) => {
    const user = await UserService.createNewUser(req.body);
    if (user) {
        res.status(200).json({code: "success", msg: "Account created successfully. Please login to continue."});
    } else {
        res.status(400).json({code: "error", msg: "Failed to create account using given details. Try again with a different email"});
    }
});

module.exports = router;