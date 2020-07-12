const router = require('express').Router();

const ReviewService = require('../services/review.service');
const PaperService = require('../services/paper.service');

router.post("/", async (req, res) => {
    var reviewAdded = await ReviewService.addReview(req.user.account, req.body.paper, req.body.rating, req.body.review, req.body.password);
    if (reviewAdded) {
        res.status(200).json({
            code: "success",
            msg: "Review added successfully"
        });
    } else {
        res.status(500).json({
            code: "failure",
            msg: "Either you have already reviewed this paper or something went wrong. Please try again after sometime."
        });
    }
});

router.get("/:account/:paper", async (req, res) => {
    var review = await ReviewService.getReview(req.params.account, req.params.paper);
    if (review !== "0") {
        res.status(200).json({
            code: "success",
            rating: review
        });
    } else {
        res.status(404).json({
            code: "failure",
            msg: "Either no review exists or rating is 0"
        });
    }
});

module.exports = router;