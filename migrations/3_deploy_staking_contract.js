const StakingContract = artifacts.require("Staking");
const StakeContract = artifacts.require("StakingToken");
const RewardContract = artifacts.require("RewardToken");

module.exports = async function (deployer) {
  // Deploy StakeContract
  await deployer.deploy(StakeContract, 1000);

  // Deploy RewardContract
  await deployer.deploy(RewardContract, 1000000, { gas: 6721975 });

  // Deploy StakingContract with addresses of StakeContract and RewardContract
  await deployer.deploy(StakingContract, StakeContract.address, RewardContract.address, { gas: 6721975 });
};
