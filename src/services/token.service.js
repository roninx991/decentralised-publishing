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
                await web3.eth.personal.unlockAccount(process.env.COINBASE, process.env.COINBASE_PWD);
                await web3.eth.personal.unlockAccount(account, password);
                var txHashToken = await instance.transfer(account, amount, {from: process.env.COINBASE, gas: 100000});
                var txHash = await web3.eth.sendTransaction({from: account, to: process.env.COINBASE, value: 1});
                web3.eth.personal.lockAccount(process.env.COINBASE);
                web3.eth.personal.lockAccount(account);
                return {
                    code: "success",
                    tokenTxHash: txHashToken,
                    ethTxHash: txHash
                };
            } catch (err) {
                console.log(err);
                return {
                    code: "failure",
                    msg: "Somthing went wrong. Please make sure your account has sufficient balance to buy tokens."
                };
            }
        })
        .catch((err) => {
            console.log(err);
        })

}

exports.sellToken = (account, amount, password) => {
    return DPTokenContract
        .deployed()
        .then(async (instance) => {
            try {
                await web3.eth.personal.unlockAccount(process.env.COINBASE, process.env.COINBASE_PWD);
                await web3.eth.personal.unlockAccount(account, password);
                var txHashToken = await instance.transfer(process.env.COINBASE, amount, {from: account, gas: 100000});
                var txHash = await web3.eth.sendTransaction({from: process.env.COINBASE, to: account, value: amount});
                web3.eth.personal.lockAccount(process.env.COINBASE);
                web3.eth.personal.lockAccount(account);
                console.log("Transaction successful.");
                return {
                    code: "success",
                    tokenTxHash: txHashToken,
                    ethTxHash: txHash
                };
            } catch (err) {
                console.log(err);
                return {
                    code: "failure",
                    msg: "Somthing went wrong. Please make sure your account has sufficient balance to buy tokens."
                };
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

exports.transfer = (from, to, amount) => {
    return DPTokenContract
        .deployed()    
        .then(async (instance) => {
            try {
                var txHashToken = await instance.transfer(to, amount, {from: from, gas: 100000});                
                return {
                    code: "success",
                    tokenTxHash: txHashToken,
                };
            } catch (err) {
                console.log(err);
                return {
                    code: "failure",
                    msg: "Somthing went wrong. Please make sure your account has sufficient balance to transfer tokens."
                };
            }
        })
}

exports.getBalance = (account) => {
    return DPTokenContract
        .deployed()
        .then(async (instance) => {
            var balance = await instance.balanceOf(account);
            return balance.toString();
        })
        .catch((err) => {
            console.log(err);
        });
}

