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

ReviewerContract.setProvider(provider);

exports.addReview = (account, hash, rating, review, password) => {
    return ReviewerContract
        .deployed()
        .then(async (instance) => {
            var reviewed = await hasReviewed(account, hash);
            if(!reviewed) {
                await web3.eth.personal.unlockAccount(account, password);
                console.log("Unlocked account");
                await instance.addReview(account, hash, rating, {from: account, gas: 100000});
                console.log("Added review for paper by reviewer");
                var paperUpdated = await updatePaper(hash, account, rating, password);
                if (paperUpdated) {
                    var paper = await Paper.findOne({location: hash});
                    paper.reviews.push({
                        reviewer: account,
                        text: review
                    });
                    paper.save();
                    console.log("Review pushed in DB");
                }
                web3.eth.personal.lockAccount(account);
                console.log("Locked account");
                return Promise.resolve(true);    
            }
            return false;
        })
        .catch(err => {
            console.log(err);
            return false;
        });
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

async function updatePaper(hash, account, rating, password) {
    await PaperService.addReviewer(hash, account, password);
    console.log("Reviewer added in paper reviewers");
    await PaperService.updateRating(hash, account, rating, password, {from: account, gas: 100000});
    console.log("Paper rating updated");
    return Promise.resolve(true);
}