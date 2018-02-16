var RooToken = artifacts.require("./RooToken.sol");
var RooExchange = artifacts.require("./RooExchange.sol");

module.exports = function(deployer) {
  deployer.deploy(RooToken);
  deployer.deploy(RooExchange);
};
