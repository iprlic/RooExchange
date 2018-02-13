var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var RooToken = artifacts.require("./RooToken.sol");
var RooExchange = artifacts.require("./RooExchange.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(RooToken);
  deployer.deploy(RooExchange);
};
