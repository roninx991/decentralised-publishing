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
    const user = new Promise((resolve) => {
        resolve(UserService.createNewUser(req.body));
    });
    console.log(user);
    if (user) {
        res.status(200).json({_id: user.id, account: user.account});
    } else {
        res.status(400).json({error: "Error creating new user."});
    }
});

module.exports = router;