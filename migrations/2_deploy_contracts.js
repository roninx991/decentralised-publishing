const Token = artifacts.require("DPToken");
const Paper = artifacts.require("PaperContract");
// const Test = artifacts.require("Test");

module.exports = function(deployer) {
    deployer.deploy(Token);
    deployer.deploy(Paper);
    // deployer.deploy(Test);
};