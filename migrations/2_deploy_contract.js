var E20 = artifacts.require("E20");
var E20Incentive = artifacts.require("E20Incentive");
const config = require("../config.json");
const testconfig = require("../test.config.json");

module.exports = function(deployer, network, accounts) {
  if (network == "main") {
    deployer.deploy(
      E20Incentive,
      config._tokenAddress,
      config._ethFee,
      config._minToken,
      config._maxToken,
      config._intRate,
      config._intRounds,
      config._bonusRate,
      config._claimTime,
      config._platformWallet
    );
  } else if (network == "test") {
    deployer.deploy(E20).then(function() {
      return deployer.deploy(
        E20Incentive,
        E20.address,
        testconfig._ethFee,
        testconfig._minToken,
        testconfig._maxToken,
        testconfig._intRate,
        testconfig._intRounds,
        testconfig._bonusRate,
        testconfig._claimTime,
        accounts[0]
      );
    });
  } else {
    deployer.deploy(E20).then(function() {
      return deployer.deploy(
        E20Incentive,
        E20.address,
        config._ethFee,
        config._minToken,
        config._maxToken,
        config._intRate,
        config._intRounds,
        config._bonusRate,
        config._claimTime,
        accounts[0]
      );
    });
  }
};
