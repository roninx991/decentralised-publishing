const Token = artifacts.require("DPToken");
const Paper = artifacts.require("PaperContract");
const Reviewer = artifacts.require("ReviewerContract");

module.exports = function(deployer) {
    deployer.deploy(Token);
    deployer.deploy(Paper);
    deployer.deploy(Reviewer);
};