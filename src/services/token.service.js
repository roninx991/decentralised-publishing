const Web3 = require('web3');
const Contract = require('truffle-contract');
const path = require('path');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const provider = new Web3.providers.HttpProvider('http://localhost:8545');

const DPTokenContractJSON = require(path.join(__dirname, '../../build/contracts/DPToken.json'));
const DPTokenContract = Contract(DPTokenContractJSON);

DPTokenContract.setProvider(provider);

exports.buyToken = (account, amount, password) => {
    return DPTokenContract
        .deployed()
        .then(async (instance) => {
            try {
                // console.log(web3.eth);
                var unlockCoinbase = await web3.eth.personal.unlockAccount(process.env.COINBASE, process.env.COINBASE_PWD);
                console.log(unlockCoinbase);
                var unlockAccount = await web3.eth.personal.unlockAccount(account, password);
                console.log(unlockAccount);
                // var txHashToken = await instance.transfer(account, amount, {from: process.env.COINBASE, gas: 50000});
                // console.log(txHashToken);
                var txHash = await web3.eth.sendTransaction({from: account, to: process.env.COINBASE, value: 1});
                console.log(txHash);
                var lockCoinbase = await web3.eth.personal.lockAccount(process.env.COINBASE);
                console.log(lockCoinbase);
                var lockAccount = await web3.eth.personal.lockAccount(account);
                console.log(lockAccount);
                return true;
            } catch (err) {
                console.log(err);
                return false;
            }
        })
        .catch((err) => {
            console.log(err);
        })

}

exports.sellToken = (account, amount) => {
    return DPTokenContract
        .deployed()
        .then(async (instance) => {
            try {
                await web3.eth.personal.unlockAccount(web3.eth.accounts[0], process.env.COINBASE_PWD);
                await web3.eth.personal.unlockAccount(account, password);
                await instance.transfer(web3.eth.accounts[0], amount, {from: account, gas: 100000});
                await web3.eth.sendTransaction({from: web3.eth.accounts[0], to: account, value: amount});
                await web3.eth.personal.lockAccount(web3.eth.accounts[0]);
                await web3.eth.personal.lockAccount(account);
                console.log("Transaction successful.");
                return true;
            } catch (err) {
                console.log(err);
                return false;
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

exports.getBalance = (account) => {
    return DPTokenContract
        .deployed()
        .then(async (instance) => {
            var balance = await instance.balanceOf.call(account);
            return balance.toString();
        })
        .catch((err) => {
            console.log(err);
        });
}

