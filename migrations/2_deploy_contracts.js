var RooToken = artifacts.require("./RooToken.sol");
var RooExchange = artifacts.require("./RooExchange.sol");

module.exports = function(deployer) {
  deployer.deploy(RooToken);
  deployer.link(RooToken, RooExchange);
  deployer.deploy(RooExchange);
};
