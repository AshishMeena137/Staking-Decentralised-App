const RewardContract = artifacts.require("RewardToken");

module.exports = function (deployer) {
  deployer.deploy(RewardContract, 1000000, { gas: 6721975 });
};
