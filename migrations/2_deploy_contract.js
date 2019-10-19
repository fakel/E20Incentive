var E20 = artifacts.require("E20");
var E20Incentive = artifacts.require("E20Incentive");

module.exports = function(deployer) {
  deployer.deploy(E20).then(function(){
    return deployer.deploy(E20Incentive,E20.address,1,1,100,100,4,500,0);
  })
}