var RooToken = artifacts.require("./RooToken.sol");

contract('RooToken', function(accounts) {

	it("...first account should own all tokens", function() {
		var _totalSupply;
		var rooTokenInstance;

		return RooToken.deployed().then(function(instance){
			rooTokenInstance = instance;
			return rooTokenInstance.totalSupply.call();
		}).then(function(totalSupply){
			_totalSupply = totalSupply;
			return rooTokenInstance.balanceOf(accounts[0]);
		}).then(function(balanceAccountOwner){
			assert.equal(balanceAccountOwner.toNumber(), _totalSupply.toNumber(), "Total amount of tokens is owned by first account");
		});
  
	});

});
