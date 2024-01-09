const StakeContract = artifacts.require("StakingToken");

module.exports = function (deployer) {
  deployer.deploy(StakeContract, 1000);
};
