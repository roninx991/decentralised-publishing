const router = require('express').Router();

const PaperService = require('../services/paper.service');

router.post("/upload/", async (req, res) => {
    var paperHash = await PaperService.createPaper(req.user.email, req.user.account, req.body.password, req.body.title, req.files.file);
    if (paperHash) {
        res.status(200).json({
            code: "success", 
            msg: paperHash
        });
    } else {
        res.status(500).json({
            code: "failure",
            msg: "File upload failed."
        });
    }
});

router.get("/", async (req, res) => {
    try {
        var papers = await PaperService.getAllPapers(req.user.email);
        if (papers && papers.length !== 0) {
            res.status(200).json(papers);
        } else {
            res.status(404).json({
                error: "Unable to retreive papers for given user."
            })
        }    
    } catch (err) {
        res.status(500).json({
            error: "Fatal error"
        });
        console.log(err);
    }
})

router.get("/details/:id", async (req, res) => {
    var paper = await PaperService.getPaperById(req.params.id);
    if (paper !== null) {
        res.status(200).json({
            code: "success", 
            paper: {
                location: paper.location,
                title: paper.title,
                owner: paper.owner,
                author: paper.author,
                status: paper.status,
                rating: paper.rating,
                reviews: paper.reviews,
            }
        });
    } else {
        res.status(500).json({
            code: "failure",
            msg: "Failed to retrieve paper status."
        });
    }
});

module.exports = router;