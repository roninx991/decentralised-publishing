const Token = artifacts.require("DPToken");
const Main = artifacts.require("MainContract");

module.exports = function(deployer) {
    deployer.deploy(Token);
    deployer.deploy(Main);
};