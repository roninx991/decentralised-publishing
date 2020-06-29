const Token = artifacts.require("DPToken");
const Paper = artifacts.require("PaperContract");

module.exports = function(deployer) {
    deployer.deploy(Token);
    deployer.deploy(Paper);
};