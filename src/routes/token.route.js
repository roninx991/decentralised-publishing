const router = require('express').Router();

const TokenService = require('../services/token.service');

router.post("/buy/", async (req, res) => {
    var response = await TokenService.buyToken(req.body.account, req.body.amount, req.body.password);
    if (response) {
        if (response.code === "success") {
            res.status(200).json(
                {
                    code: "success", 
                    msg: {
                        tokenTxHash: response.tokenTxHash,
                        ethTxHash: response.ethTxHash,
                        disclaimer: "Please save these Transaction hashes for future reference."
                    }
                }
            );
        } else if (response.code === "failure") {
            res.status(400).json(response);
        } else {
            res.status(500).json({code: "failure", msg: "Unknown error"});
        }
    } else {
        res.status(500).json({code: "failure", msg: "No response from backend"});
    }
    
});

router.post("/sell/", async (req, res) => {
    var response = await TokenService.sellToken(req.body.account, req.body.amount, req.body.password);
    if (response) {
        if (response.code === "success") {
            res.status(200).json(
                {
                    code: "success", 
                    msg: {
                        tokenTxHash: response.tokenTxHash,
                        ethTxHash: response.ethTxHash,
                        disclaimer: "Please save these Transaction hashes for future reference."
                    }
                }
            );
        } else if (response.code === "failure") {
            res.status(400).json(response);
        } else {
            res.status(500).json({code: "failure", msg: "Unknown error"});
        }
    } else {
        res.status(500).json({code: "failure", msg: "No response from backend"});
    }});

router.get("/balance/:account", async (req, res) => {
    var bal = await TokenService.getBalance(req.params.account);
    res.status(200).json({balance: bal});
});

module.exports = router;