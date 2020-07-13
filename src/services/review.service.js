const Web3 = require('web3');
const Contract = require('truffle-contract');
const ipfs_api = require('ipfs-api');

const Paper = require('../models/paper.model');
const path = require('path');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const provider = new Web3.providers.HttpProvider('http://localhost:8545');
const ipfs = ipfs_api('localhost', '5001');

const ReviewerContractJSON = require(path.join(__dirname, '../../build/contracts/ReviewerContract.json'));
const ReviewerContract = Contract(ReviewerContractJSON);

const PaperService = require('./paper.service');
const TokenService = require('./token.service');

ReviewerContract.setProvider(provider);

exports.addReview = async (account, hash, rating, review, password) => {
    try {
        var status = await PaperService.getPaperStatus(hash);
        if (status) throw new Error("Reviewing for this paper has been closed");
        var author = await PaperService.getPaperAuthor(hash);
        if (author == account) throw new Error("Author is not allowed to review his own paper");
        var reviewed = await hasReviewed(account, hash);
        if (reviewed) throw new Error("User has already reviewed this paper.");
        var reviewerInstance = await ReviewerContract.deployed()
        await web3.eth.personal.unlockAccount(process.env.COINBASE, process.env.COINBASE_PWD);
        console.log("Unlocked account");
        reviewerInstance.addReview(account, hash, rating, {from: process.env.COINBASE, gas: 100000});
        TokenService.transfer(account, process.env.COINBASE, 10);
        console.log("Submitted review for paper by reviewer");
    } catch (err) {
        console.log(err);
        return false;
    } finally {
        web3.eth.personal.lockAccount(process.env.COINBASE);
        web3.eth.personal.lockAccount(account);
    }

    try {
        PaperService.addReviewer(hash, account, password);        
        console.log("Reviewer to be added in paper reviewers.");
        var paper = await Paper.findOne({location: hash});
        paper.reviews.push({
            reviewer: account,
            text: review
        });
        paper.save();
        console.log("Review pushed in DB");
        status = await PaperService.getPaperStatus(hash);
        if (status) {
            var reviewers = await PaperService.getPaperReviewers(hash);
            var credSum = 0, weightedSum = 0, mean = 0;
            var cred = 0, reviewerCredibility = 0, reviewerRating = 0;
            // Finding weighted mean rating
            for (const reviewer of reviewers) {
                cred = await reviewerInstance.getCredibility(reviewer);
                console.log("Credibility of reviewer: " + cred.toString());
                reviewerCredibility = (parseInt(cred.toString()) == 0) ? 1 : parseInt(cred.toString());
                reviewerRating = await reviewerInstance.getReview(reviewer, hash);
                weightedSum += reviewerCredibility*parseInt(reviewerRating.toString());
                credSum += reviewerCredibility;
            }
            mean = parseInt(Math.floor(weightedSum / credSum));
            PaperService.setRating(hash, mean);
            // Transfer tokens to reviewer accounts and update credibility
            await web3.eth.personal.unlockAccount(process.env.COINBASE, process.env.COINBASE_PWD);
            for (const reviewer of reviewers) {
                var amount = Math.max(-9, parseInt((3 - Math.floor(Math.abs(reviewerRating - mean))) * 10.0 / 3.0));
                var newCredibility = (reviewerCredibility + amount) < 0 ? 0 : (reviewerCredibility+amount);
                reviewerInstance.setCredibility(account, newCredibility, { from: process.env.COINBASE, gas: 100000 });
                TokenService.transfer(process.env.COINBASE, reviewer, 10 + amount, { from: process.env.COINBASE, gas: 100000 });
            }
            console.log("Credibility updation submitted successfully");
            console.log("Rewards distribution submitted successfully");
        }
        return Promise.resolve(true);     

    } catch (err) { 
        console.log(err);
        return false;
    } finally {
        web3.eth.personal.lockAccount(account);
        web3.eth.personal.lockAccount(process.env.COINBASE);
        console.log("Locked account");
    }

}
    

exports.getReview = (account, hash) => {
    return ReviewerContract
        .deployed()
        .then(async (instance) => {
            var review = await instance.getReview(account, hash);
            console.log(review.toString());
            return Promise.resolve(review.toString());
        })
        .catch(err => {
            console.log(err);
            return 0;
        });
}

function hasReviewed(account, hash) {
    return ReviewerContract
        .deployed()
        .then(async (instance) => {
            var reviewed = await instance.hasReviewed(account, hash);
            console.log(reviewed);
            return Promise.resolve(reviewed);
        })
        .catch(err => {
            console.log(err);
            return 0;
        });
}