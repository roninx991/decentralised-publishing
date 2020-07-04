const Web3 = require('web3');
const Contract = require('truffle-contract');
// const ipfs_api = require('ipfs-api');

// const User = require('../models/user.model');
const path = require('path');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const provider = new Web3.providers.HttpProvider('http://localhost:8545');
// const ipfs = ipfs_api('localhost', '5001');

const TestJSON = require(path.join(__dirname, './build/contracts/PaperContract.json'));
const Test = Contract(TestJSON);

Test.setProvider(provider);


function createTest(id) {
    return Test.deployed()
        .then(async instance => {
            await instance.createPaper(id, {from: "0xA4c1b00Af0bcD0aa1C6BF25e075F361b9E459A0d", gas: 100000});
            console.log("Test Created");
            return Promise.resolve(true);
        })
        .catch(err => {
            console.log(err)
        });
}

function getDetails(id) {
    Test.deployed()
    .then(async instance => {
        var author = await instance.getAuthor(id);
        console.log(author);
        var owner = await instance.getOwner(id);
        console.log(owner);
        var rating = await instance.getRating(id);
        console.log(rating.toString());
        var status = await instance.getStatus(id);
        console.log(status);
    })
    .catch(err => {
        console.log(err)
    });
}

async function main() {
    await createTest("QmX52ithcQPeACXyYJNA9jwAkWK3ai6wdcKYHjYe6xmRcx567");
    getDetails("QmX52ithcQPeACXyYJNA9jwAkWK3ai6wdcKYHjYe6xmRcx567");
}

main();