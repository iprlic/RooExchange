var RooToken = artifacts.require("./RooToken.sol");
var RooExchange = artifacts.require("./RooExchange.sol");

contract('RooExchange Basic Tests', function(accounts) {

	it("...should be possible to add tokens to the exchange", function() {
		var rooTokenInstance;
		var rooExchangeInstance;

		return RooToken.deployed().then(function(tokenInstance){
			rooTokenInstance = tokenInstance;
			return RooExchange.deployed()
		}).then(function(exchangeInstance){
			rooExchangeInstance = exchangeInstance;
			return rooExchangeInstance.addToken("ROO", rooTokenInstance.address);
		}).then(function(result){
			assert(result.logs[0].event, "TokenAddedToSystem", "TokenAddedToSystem not emited");
			return rooExchangeInstance.hasToken.call("ROO");
		}).then(function(hasToken){
			assert.equal(hasToken, true, "Token was not added");
			
			return rooExchangeInstance.hasToken.call("ROO123");
		}).then(function(hasToken){
			assert.equal(hasToken, false, "Token that was not added was found in exchange");
		});
  
	});

	it("...should be possible to deposit tokens", function() {
		var rooTokenInstance;
		var rooExchangeInstance;

		return RooToken.deployed().then(function(tokenInstance){
			rooTokenInstance = tokenInstance;
			return RooExchange.deployed()
		}).then(function(exchangeInstance){
			rooExchangeInstance = exchangeInstance;
			return rooTokenInstance.approve(rooExchangeInstance.address, 2000);
		}).then(function(tx){
			return rooExchangeInstance.depositToken("ROO", 2000);
		}).then(function(tx){
			return rooExchangeInstance.getBalance("ROO");
		}).then(function(balance){
			assert.equal(balance, 2000, "There should be 2000 tokens at the exchange address");
		});  
	});

	it("...should be possible to withdraw tokens", function() {
		var rooTokenInstance;
		var rooExchangeInstance;

		var exchangeTokensBeforeWitdrawl;
		var tokensBeforeWitdrawl;
		var exchangeTokensAfterWitdrawl;
		var tokensAfterWitdrawl;

		return RooToken.deployed().then(function(tokenInstance){
			rooTokenInstance = tokenInstance;
			return RooExchange.deployed()
		}).then(function(exchangeInstance){
			rooExchangeInstance = exchangeInstance;
			return rooExchangeInstance.getBalance("ROO");
		}).then(function(balance){
			exchangeTokensBeforeWitdrawl = balance.toNumber();
			return  rooTokenInstance.balanceOf(accounts[0]);
		}).then(function(balance){
			tokensBeforeWitdrawl = balance.toNumber();
			return rooExchangeInstance.withdrawToken("ROO", exchangeTokensBeforeWitdrawl);
		}).then(function(){
			return rooExchangeInstance.getBalance("ROO");
		}).then(function(balance){
			exchangeTokensAfterWitdrawl = balance.toNumber();
			return  rooTokenInstance.balanceOf(accounts[0]);
		}).then(function(balance){
			tokensAfterWitdrawl = balance.toNumber();
			assert.equal(exchangeTokensAfterWitdrawl, 0, "There should be 0 tokens in the exchange after withdrawl");
			assert.equal(tokensAfterWitdrawl, tokensBeforeWitdrawl + exchangeTokensBeforeWitdrawl, "Current token balance is not equal to sum of exhange tokens and previous balance");
		})
	});


	it("...should be possible to deposit and withdraw Ether", function() {
		var rooExchangeInstance;
		var balanceBeforeTheTransaction = web3.eth.getBalance(accounts[0]);
		var balanceAfterDeposit;
		var balanceAfterWithdraw;
		var gasUsed = 0;

		return RooExchange.deployed().then(function(instance){
			rooExchangeInstance = instance;
			return rooExchangeInstance.depositEther({ from: accounts[0], value: web3.toWei(1, "ether") });
		}).then(function(tx){
			gasUsed += tx.receipt.cumulativeGasUsed * web3.eth.getTransaction(tx.receipt.transactionHash).gasPrice.toNumber();
			balanceAfterDeposit = web3.eth.getBalance(accounts[0]);
			return rooExchangeInstance.getEthBalanceInWei.call();
		}).then(function(balanceInWei){
			assert.equal(balanceInWei.toNumber(), web3.toWei(1, "ether"), "There is not 1 ether available after deposit");
			assert.isAtLeast(balanceBeforeTheTransaction.toNumber() - balanceAfterDeposit.toNumber(),  web3.toWei(1, "ether"), "Account balance has not been reduced");

			return rooExchangeInstance.withdrawEther(web3.toWei(1, "ether"));		
		}).then(function(tx){
			balanceAfterWithdraw = web3.eth.getBalance(accounts[0]);
			return rooExchangeInstance.getEthBalanceInWei.call();
		}).then(function(balanceInWei){
			assert.equal(balanceInWei.toNumber(), 0, "There is still ether available even after withdrawl");
			assert.isAtLeast(balanceAfterWithdraw.toNumber(), balanceBeforeTheTransaction - gasUsed*2, "Balance after the transactions is less then it should be accounting for the gas price");

		});
  
	});

});