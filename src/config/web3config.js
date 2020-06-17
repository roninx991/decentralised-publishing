const Web3 = require('web3');

require('dotenv').config();

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER));

module.exports = web3;