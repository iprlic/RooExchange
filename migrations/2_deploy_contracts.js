var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Owned = artifacts.require("./owned.sol");
var RooToken = artifacts.require("./RooToken.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Owned);
  deployer.link(Owned, RooToken);
  deployer.deploy(RooToken);
};
