const Web3 = require('web3');
const Contract = require('truffle-contract');
const ipfs_api = require('ipfs-api');
const User = require('../models/user.model');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const ipfs = ipfs_api('localhost', '5001');

exports.createPaper = async (account, file) => {
    var user = await User.findOne({account: account});
    var fileHashObj = await ipfs.files.add(new Buffer.from(file.data));
    user.papers.push(fileHashObj[0].hash);
    await user.save();
    return user.papers;
}

exports.getPaperStatus = (paperHash) => {

}

exports.getPaperOwner = (paperHash) => {

}

exports.getPaperReviewers = (paperHash) => {

}

exports.getPaperRating = (paperHash) => {
    
}

exports.getPaperCost = (paperHash) => {

}

exports.canPaperBeReviewedByReviewer = (account) => {

}