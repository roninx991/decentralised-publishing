const router = require('express').Router();

const UserService = require('../services/user.service');

router.get("/", async (req, res) => {
    if (req.user) {
        res.status(200).json(req.user);
    } else {
        res.sendStatus(401);
    }
})

module.exports = router;