const Web3 = require('web3');
const Contract = require('truffle-contract');
const ipfs_api = require('ipfs-api');

const User = require('../models/user.model');
const Paper = require('../models/paper.model');
const path = require('path');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const provider = new Web3.providers.HttpProvider('http://localhost:8545');
const ipfs = ipfs_api('localhost', '5001');

const PaperContractJSON = require(path.join(__dirname, '../../build/contracts/PaperContract.json'));
const PaperContract = Contract(PaperContractJSON);

const TokenService = require('./token.service')

PaperContract.setProvider(provider);

exports.createPaper = (email, account, password, title, file) => {
    return PaperContract
        .deployed()
        .then(async (instance) => {
            var user = await User.findOne({email: email});
            var fileHashObj = await ipfs.files.add(new Buffer.from(file.data));
            console.log("Hash: ", fileHashObj[0].hash);
            await createPaperInDB(fileHashObj[0].hash, title);
            user.papers.push(fileHashObj[0].hash);
            console.log("Pushed hash value in Mongo");
            await web3.eth.personal.unlockAccount(account, password);
            console.log("Unlocked account");
            await TokenService.transfer(account, process.env.COINBASE, 100);
            console.log("Transferred tokens");
            await instance.createPaper(fileHashObj[0].hash, {from: account, gas: 100000});
            console.log("Paper created in Contract");
            web3.eth.personal.lockAccount(account);
            console.log("Locked account");
            await user.save();
            console.log("Paper is saved.");
            return user.papers;
        })
        .catch(err => {
            console.log(err);
            return null;
        })
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

exports.getPaperTitle = (paperHash) => {
    return Paper
            .findOne({location: paperHash})
            .then(paper => {
                return paper.title;
            })
            .catch(err => {
                console.log(err);
                return null;
            });
}

exports.addReviewer = (paperHash, account, password) => {
    return PaperContract
        .deployed()
        .then(async (instance) => {
            await web3.eth.personal.unlockAccount(account, password);
            console.log("Unlocked account");
            await instance.addReviewers(paperHash, account, {from: account, gas: 100000});
            console.log("Added reviewer");
            web3.eth.personal.lockAccount(account);
            console.log("Locked account");
            return Promise.resolve(true);
        })
        .catch(err => {
            console.log(err);
            return false;
        });
}

exports.updateRating = (paperHash, account, rating, password) => {
    return PaperContract
        .deployed()
        .then(async (instance) => {
            await web3.eth.personal.unlockAccount(account, password);
            console.log("Unlocked account");
            await TokenService.transfer(account, process.env.COINBASE, 10);
            console.log("Transferred tokens");
            await instance.addToRating(paperHash, rating, {from: account, gas: 100000});
            console.log("Added to rating");
            web3.eth.personal.lockAccount(account);
            console.log("Locked account");
            return Promise.resolve(true);
        })
        .catch(err => {
            console.log(err);
            return false;
        });
}

async function createPaperInDB(location, title) {
    var p = await Paper.findOne({location: location});
    if (p) {
        throw Error("Paper already exists");
    }
    var paper = new Paper();
    paper.location = location;
    paper.title = title;
    paper.save();
    console.log("Paper meta data saved in DB");
    return Promise.resolve(true);
}
