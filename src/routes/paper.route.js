const router = require('express').Router();

const PaperService = require('../services/paper.service');

router.post("/upload/", async (req, res) => {
    const paperHash = await PaperService.createPaper(req.body.account, req.files.file);
    if (paperHash) {
        res.status(200).json({
            code: "success", 
            msg: paperHash
        });
    } else {
        res.status(500).json({
            code: "failure",
            msg: "File upload failed."
        })
    }
});

module.exports = router;