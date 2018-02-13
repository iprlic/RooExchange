var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var RooToken = artifacts.require("./RooToken.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(RooToken);
};
