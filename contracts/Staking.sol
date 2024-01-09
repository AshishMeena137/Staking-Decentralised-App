// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Staking is ReentrancyGuard{
  IERC20 public _stakingToken;
  IERC20 public _rewardToken;
  address payable Owner;

  uint public constant REWARD_RATE=10*1e18;
  uint private totalStakedTokens;
  uint public rewardPerTokenStored;
  uint public lastUpdateTime;

  mapping(address=>uint) public stakedBalance;
  mapping(address=>uint) public rewards;
  mapping(address=>uint) public userRewardPerTokenPaid;

  event Staked(address indexed user, uint256 indexed amount);
  event Withdrawn(address indexed user, uint256 indexed amount);
  event RewardsClaimed(address indexed user, uint256 indexed amount);
  
  constructor(address stakingToken,address rewardToken){
    _stakingToken=IERC20(stakingToken);
    _rewardToken=IERC20(rewardToken);
    Owner = payable(msg.sender);
  }

  function rewardPerToken() public view returns(uint){
    if(totalStakedTokens==0){
        return rewardPerTokenStored;
    }
    uint totalTime = block.timestamp-lastUpdateTime;
    uint totalRewards = REWARD_RATE*totalTime; 
    return rewardPerTokenStored+((totalRewards*1e18)/totalStakedTokens);
  }

  function earned(address account) public view returns(uint){
    return (((stakedBalance[account]*(rewardPerToken()-userRewardPerTokenPaid[account])))/1e18)+(rewards[account]);
  }

  modifier updateReward(address account){
    rewardPerTokenStored = rewardPerToken();
    lastUpdateTime = block.timestamp;
    rewards[account] = earned(account);
    userRewardPerTokenPaid[account] = rewardPerTokenStored;
    _;
  }

  function stake(uint amount) external nonReentrant updateReward(msg.sender){
    require(amount > 0, "Amount must be > 0");
    require(_stakingToken.balanceOf(msg.sender) >= amount, "You don't have fund's");
    totalStakedTokens += amount;
    stakedBalance[msg.sender] += amount;
    emit Staked(msg.sender, amount);

    bool success = _stakingToken.transferFrom(msg.sender, address(this), amount);
    require(success, "Transection Failed");
  }

  function withdraw(uint amount) external nonReentrant updateReward(msg.sender){
    require(amount > 0, "Amount must be > 0");
    require(stakedBalance[msg.sender]>=amount,"Not Enough Balance");
    totalStakedTokens -= amount;
    stakedBalance[msg.sender] -= amount;
    emit Withdrawn(msg.sender, amount);

    bool success = _stakingToken.transfer(msg.sender, amount);
    require(success, "Transection Failed");
  }

    function getReward() external nonReentrant updateReward(msg.sender){
    uint reward = rewards[msg.sender];
    require(reward>0,"No reward to Transfer");
    rewards[msg.sender] = 0;
    emit RewardsClaimed(msg.sender, reward);

    bool success = _rewardToken.transfer(msg.sender, reward);
    require(success, "Transection Failed");
  }

  function buyToken(uint amount) public payable {
     require(msg.value >= 0.1 ether * amount);
     bool succus = _stakingToken.transfer(msg.sender, amount*10**18);
     require(succus, "Transection failed");
  }

  function withdrawEthers() public payable{
      require(msg.sender == Owner, "Only owner");
      require(address(this).balance > 0, "No funds available");
      Owner.transfer(address(this).balance);
  }

}