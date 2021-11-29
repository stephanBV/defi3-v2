const voting_cyril = artifacts.require("Voting_cyril");

module.exports = function (deployer) {
  deployer.deploy(voting_cyril);
};