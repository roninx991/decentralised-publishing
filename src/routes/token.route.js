const router = require('express').Router();

const TokenService = require('../services/token.service');

router.post("/buy/", async (req, res) => {
    var success = await TokenService.buyToken(req.body.account, req.body.amount, req.body.password);
    res.status(200).json({code: "success", msg: success});
});

router.post("/sell/", async (req, res) => {
    var success = await TokenService.sellToken(req.body.account, req.body.amount, req.body.password);
    res.status(200).json({code: "success", msg: success});
});

router.get("/balance/:account", async (req, res) => {
    var bal = await TokenService.getBalance(req.params.account);
    res.status(200).json({balance: bal});
});

module.exports = router;