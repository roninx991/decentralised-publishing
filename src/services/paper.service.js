const Web3 = require('web3');
const User = require('../models/user.model');
const crypto = require('crypto');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

exports.createPaper = (account) => {

}

exports.getPaperStatus = (paperHash) => {

}

exports.setPaperStatus = (paperHash) => {

}

exports.getPaperOwner = (paperHash) => {

}

exports.setPaperOwner = (paperHash) => {

}

exports.getPaperCreationTimestamp = (paperHash) => {

}

exports.getPaperReviewers = (paperHash) => {

}

exports.getPaperRating = (paperHash) => {
    
}

exports.setPaperRating = (paperHash, account) => {

}

exports.getPaperCost = (paperHash) => {

}

exports.setPaperCost = (paperHash) => {

}

exports.canPaperBeReviewedByReviewer = (account) => {

}