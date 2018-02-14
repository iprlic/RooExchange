var RooToken = artifacts.require("./RooToken.sol");

contract('RooToken Basic Tests', function(accounts) {

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
			assert.equal(balanceAccountOwner.toNumber(), _totalSupply.toNumber(), "Total amount of tokens is not owned by first account");
		});
  
	});

	it("...second account should own no tokens", function() {

		var rooTokenInstance;

		return RooToken.deployed().then(function(instance){
			rooTokenInstance = instance;
			return rooTokenInstance.balanceOf(accounts[1]);
		}).then(function(balanceAccountOwner){
			assert.equal(balanceAccountOwner.toNumber(), 0, "Second address owns tokens");
		});
  
	});

	it("...should send tokens correctly", function() {

		var rooTokenInstance;

		var account_one = accounts[0];
		var account_two = accounts[1];

		var account_one_starting_balance;
		var account_one_end_balance;

		var account_two_starting_balance;
		var account_two_end_balance;


		var amount = 100;

		return RooToken.deployed().then(function(instance){
			rooTokenInstance = instance;
			return rooTokenInstance.balanceOf.call(account_one);
		}).then(function(balance){
			account_one_starting_balance = balance.toNumber();
			return rooTokenInstance.balanceOf.call(account_two);
		}).then(function(balance){
			account_two_starting_balance = balance.toNumber();
			return rooTokenInstance.transfer(account_two, amount, {from: account_one});
		}).then(function(){
			return rooTokenInstance.balanceOf.call(account_one);
		}).then(function(balance){
			account_one_end_balance = balance.toNumber();
			return rooTokenInstance.balanceOf.call(account_two);
		}).then(function(balance){
			account_two_end_balance = balance.toNumber();

			assert.equal(account_one_end_balance, account_one_starting_balance-amount, "Amount was not correctly taken from sender");
			assert.equal(account_two_end_balance, account_two_starting_balance+amount, "Amount was not correctly transfered to reciever");
		})
  
	});

});
