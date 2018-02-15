var RooToken = artifacts.require("./RooToken.sol");
var RooExchange = artifacts.require("./RooExchange.sol");

contract('RooExchange Order Tests', function (accounts) {
    before(function() {
        var instanceExchange;
        var instanceToken;
        return RooExchange.deployed().then(function (instance) {
            instanceExchange = instance;
            return instanceExchange.depositEther({from: accounts[0], value: web3.toWei(3, "ether")});
        }).then(function(txResult) {

            return RooToken.deployed();
        }).then(function(myTokenInstance) {
            instanceToken = myTokenInstance;
            return instanceExchange.addToken("ROO", instanceToken.address);
        }).then(function(txResult) {
            return instanceToken.transfer(accounts[1], 2000);
        }).then(function(txResult) {
            return instanceToken.approve(instanceExchange.address, 2000, {from: accounts[1]});
        }).then(function(txResult) {
            return instanceExchange.depositToken("ROO", 2000, {from: accounts[1]});
        });
    });

    it("...should be possible to add fully fulfill buy orders", function () {
        var rooExchangeInstance;
        return RooExchange.deployed().then(function (instance) {
            rooExchangeInstance = instance;
            return rooExchangeInstance.getSellOrderBook.call("ROO");
        }).then(function (orderBook) {
            assert.equal(orderBook.length, 2, "getSellOrderBook should have 2 elements");
            assert.equal(orderBook[0].length, 0, "OrderBook should have 0 buy offers");
            return rooExchangeInstance.sellToken("ROO", web3.toWei(2, "finney"), 5, {from: accounts[1]});
        }).then(function(txResult) {
            /**
             * Assert the logs
             */
            assert.equal(txResult.logs.length, 1, "There should have been one Log Message emitted.");
            assert.equal(txResult.logs[0].event, "LimitSellOrderCreated", "The Log-Event should be LimitSellOrderCreated");
            return rooExchangeInstance.getSellOrderBook.call("ROO");
        }).then(function(orderBook) {
            assert.equal(orderBook[0].length, 1, "OrderBook should have 1 sell offers");
            assert.equal(orderBook[1].length, 1, "OrderBook should have 1 sell volume has one element");
            assert.equal(orderBook[1][0], 5, "OrderBook should have a volume of 5 coins someone wants to sell");
            return rooExchangeInstance.buyToken("ROO", web3.toWei(3, "finney"), 5);
        }).then(function(txResult) {

            /**
             * Assert the logs
             */
            assert.equal(txResult.logs.length, 1, "There should have been one Log Message emitted.");
            assert.equal(txResult.logs[0].event, "SellOrderFulfilled", "The Log-Event should be SellOrderFulfilled");
            return rooExchangeInstance.getSellOrderBook.call("ROO");
        }).then(function(orderBook) {

            assert.equal(orderBook[0].length, 0, "OrderBook should have 0 buy offers");
            assert.equal(orderBook[1].length, 0, "OrderBook should have 0 buy volume has one element");
            return rooExchangeInstance.getBuyOrderBook.call("ROO");
        }).then(function(orderBook) {

            assert.equal(orderBook[0].length, 0, "OrderBook should have 0 sell offers");
            assert.equal(orderBook[1].length, 0, "OrderBook should have 0 sell volume elements");

        });
    });


});
