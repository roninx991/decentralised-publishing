const Web3 = require('web3');
const Contract = require('truffle-contract');
const ipfs_api = require('ipfs-api');

const User = require('../models/user.model');
const path = require('path');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const provider = new Web3.providers.HttpProvider('http://localhost:8545');
const ipfs = ipfs_api('localhost', '5001');

const PaperContractJSON = require(path.join(__dirname, '../../build/contracts/PaperContract.json'));
const PaperContract = Contract(PaperContractJSON);

const TokenService = require('./token.service')

PaperContract.setProvider(provider);

exports.createPaper = (account, password, title, file) => {
    return PaperContract
        .deployed()
        .then(async (instance) => {
            var user = await User.findOne({account: account});
            var fileHashObj = await ipfs.files.add(new Buffer.from(file.data));
            console.log("Hash: ", fileHashObj[0].hash);
            user.papers.push(fileHashObj[0].hash);
            console.log("Pushed hash value in Mongo");
            await web3.eth.personal.unlockAccount(account, password);
            console.log("Unlocked account");
            await TokenService.transfer(account, process.env.COINBASE, 100, password);
            console.log("Transferred tokens");
            await instance.createPaper(fileHashObj[0].hash, {from: account, gas: 100000});
            console.log("Paper created in Contract");
            await user.save();
            console.log("Paper is saved.");
            return user.papers;
        });
}

exports.getPaperAuthor = (paperHash) => {
    return PaperContract
        .deployed()
        .then(async (instance) => {
            var author = await instance.getAuthor(paperHash);
            return Promise.resolve(author);       
        });
}

exports.getPaperOwner = (paperHash) => {
    return PaperContract
        .deployed()
        .then(async (instance) => {
            var owner = await instance.getOwner(paperHash);
            return Promise.resolve(owner);       
        });
}

exports.getPaperRating = (paperHash) => {
    return PaperContract
        .deployed()
        .then(async (instance) => {
            var rating = await instance.getRating(paperHash);
            return Promise.resolve(rating.toString());       
        });
}

exports.getPaperStatus = (paperHash) => {
    return PaperContract
        .deployed()
        .then(async (instance) => {
            var status = await instance.getStatus(paperHash);
            return Promise.resolve(status);       
        });
}

exports.getPaperReviewers = (paperHash) => {
    return PaperContract
        .deployed()
        .then(async (instance) => {
            var reviewers = await instance.getReviewers(paperHash);
            return Promise.resolve(reviewers);       
        });
}

exports.canPaperBeReviewedByReviewer = (account) => {

}

