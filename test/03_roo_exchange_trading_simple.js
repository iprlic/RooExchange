var RooToken = artifacts.require("./RooToken.sol");
var RooExchange = artifacts.require("./RooExchange.sol");

contract('RooExchange Simple Order Tests', function (accounts) {
    before(function() {
        var instanceRooExchange;
        var instanceRooToken;
        return RooExchange.deployed().then(function (instance) {
            instanceRooExchange = instance;
            return instanceRooExchange.depositEther({from: accounts[0], value: web3.toWei(3, "ether")});
        }).then(function(txResult) {

            return RooToken.deployed();
        }).then(function(myTokenInstance) {
            instanceRooToken = myTokenInstance;
            return instanceRooExchange.addToken("ROO", instanceRooToken.address);
        }).then(function(txResult) {
            return instanceRooToken.approve(instanceRooExchange.address, 2000);
        }).then(function(txResult) {
            return instanceRooExchange.depositToken("ROO", 2000);
        });
    });


    it("...should be possible to add a limit buy order", function () {
        var rooExchangeInstance;
        return RooExchange.deployed().then(function (instance) {
            rooExchangeInstance = instance;
            return rooExchangeInstance.getBuyOrderBook.call("ROO");
        }).then(function (orderBook) {
            assert.equal(orderBook.length, 2, "BuyOrderBook should have 2 elements");
            assert.equal(orderBook[0].length, 0, "OrderBook should have 0 buy offers");
            return rooExchangeInstance.buyToken("ROO", web3.toWei(1, "finney"), 5);
        }).then(function(txResult) {
            /**
             * Assert the logs
             */
            assert.equal(txResult.logs.length, 1, "There should have been one Log Message emitted.");
            assert.equal(txResult.logs[0].event, "LimitBuyOrderCreated", "The Log-Event should be LimitBuyOrderCreated");
            return rooExchangeInstance.getBuyOrderBook.call("ROO");
        }).then(function(orderBook) {
            assert.equal(orderBook[0].length, 1, "OrderBook should have 0 buy offers");
            assert.equal(orderBook[1].length, 1, "OrderBook should have 0 buy volume has one element");
        });
    });




    it("...should be possible to add three limit buy orders", function () {
        var rooExchangeInstance;
        var orderBookLengthBeforeBuy;
        return RooExchange.deployed().then(function (exchangeInstance) {
            rooExchangeInstance = exchangeInstance;
            return rooExchangeInstance.getBuyOrderBook.call("ROO");
        }).then(function (orderBook) {
            orderBookLengthBeforeBuy = orderBook[0].length;
            return rooExchangeInstance.buyToken("ROO", web3.toWei(2, "finney"), 5); //we add one offer on top of another one, doesn't increase the orderBook
        }).then(function(txResult) {
            assert.equal(txResult.logs[0].event, "LimitBuyOrderCreated", "The Log-Event should be LimitBuyOrderCreated");
            return rooExchangeInstance.buyToken("ROO", web3.toWei(1.4, "finney"), 5); //we add a new offer in the middle
        }).then(function(txResult) {
            assert.equal(txResult.logs[0].event, "LimitBuyOrderCreated", "The Log-Event should be LimitBuyOrderCreated");
            return rooExchangeInstance.getBuyOrderBook.call("ROO");
        }).then(function(orderBook) {
            assert.equal(orderBook[0].length, orderBookLengthBeforeBuy+2, "OrderBook should have one more buy offers");
            assert.equal(orderBook[1].length, orderBookLengthBeforeBuy+2, "OrderBook should have 2 buy volume elements");
        });
    });


    it("...should be possible to add two limit sell orders", function () {
        var rooExchangeInstance;
        return RooExchange.deployed().then(function (instance) {
            rooExchangeInstance = instance;
            return rooExchangeInstance.getSellOrderBook.call("ROO");
        }).then(function (orderBook) {
            return rooExchangeInstance.sellToken("ROO", web3.toWei(3, "finney"), 5);
        }).then(function(txResult) {
            /**
             * Assert the logs
             */
            assert.equal(txResult.logs.length, 1, "There should have been one Log Message emitted.");
            assert.equal(txResult.logs[0].event, "LimitSellOrderCreated", "The Log-Event should be LimitSellOrderCreated");

            return rooExchangeInstance.sellToken("ROO", web3.toWei(6, "finney"), 5);
        }).then(function(txResult) {
            return rooExchangeInstance.getSellOrderBook.call("ROO");
        }).then(function(orderBook) {
            assert.equal(orderBook[0].length, 2, "OrderBook should have 2 sell offers");
            assert.equal(orderBook[1].length, 2, "OrderBook should have 2 sell volume elements");
        });
    });


    it("...should be possible to create and cancel a buy order", function () {
        var rooExchangeInstance;
        var orderBookLengthBeforeBuy, orderBookLengthAfterBuy, orderBookLengthAfterCancel, orderKey;
        return RooExchange.deployed().then(function (instance) {
            rooExchangeInstance = instance;
            return rooExchangeInstance.getBuyOrderBook.call("ROO");
        }).then(function (orderBook) {
            orderBookLengthBeforeBuy = orderBook[0].length;
            return rooExchangeInstance.buyToken("ROO", web3.toWei(2.2, "finney"), 5);
        }).then(function(txResult) {
            /**
             * Assert the logs
             */
            assert.equal(txResult.logs.length, 1, "There should have been one Log Message emitted.");
            assert.equal(txResult.logs[0].event, "LimitBuyOrderCreated", "The Log-Event should be LimitBuyOrderCreated");
            orderKey = txResult.logs[0].args._orderKey;
            return rooExchangeInstance.getBuyOrderBook.call("ROO");
        }).then(function (orderBook) {
            orderBookLengthAfterBuy = orderBook[0].length;
            assert.equal(orderBookLengthAfterBuy, orderBookLengthBeforeBuy + 1, "OrderBook should have 1 buy offers more than before");
            return rooExchangeInstance.cancelOrder("ROO", false, web3.toWei(2.2, "finney"), orderKey);
        }).then(function(txResult) {
            assert.equal(txResult.logs[0].event, "BuyOrderCanceled", "The Log-Event should be BuyOrderCanceled");
            return rooExchangeInstance.getBuyOrderBook.call("ROO");
        }).then(function(orderBook) {
            orderBookLengthAfterCancel = orderBook[0].length;
            assert.equal(orderBookLengthAfterCancel, orderBookLengthAfterBuy, "OrderBook should have 1 buy offers, its not cancelling it out completely, but setting the volume to zero");
            assert.equal(orderBook[1][orderBookLengthAfterCancel-1].toNumber(), 0, "The available Volume should be zero");
        });
    });


});
