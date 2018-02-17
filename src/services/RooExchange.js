import { default as contract } from 'truffle-contract'
import { default as EventEmitter } from 'events'
import RooExchangeContract from '../../build/contracts/RooExchange.json'
import getWeb3 from '../utils/getWeb3'

let _web3;
let _accounts;
let _account;
let _accountData = {
	address: null,
	balance: null
};
let _tokenBalance;
let _etherBalance;
let _rooExchange = contract(RooExchangeContract);
let _limitOrderEvents = [];
let _fulfillOrderEvents = [];

let _exchangeAddress;

let _buyOrderBook = [];
let _sellOrderBook = [];

class RooExchangeService extends EventEmitter{

	constructor() {
		super();
		getWeb3.then(results => {
			_web3 = results.web3;
			// Instantiate contract once web3 provided.
      		this._instantiateContract();
			this._watchExchangeEvents();
			this._updateTokenBalance();
			this._updateOrderBooks();
	    })
	    .catch(() => {
      		console.log('Error finding web3.');
	    });
	}

	_instantiateContract(){
		const _this = this;
    	_rooExchange.setProvider(_web3.currentProvider);
    	  // Get accounts.
	    _web3.eth.getAccounts((error, accs) => {
    		if (error != null) {
        		console.log("There was an error fetching your accounts.");
         		return;
       		}

			if (accs.length === 0) {
				console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
			 	return;
			}

	        _accounts = accs;
			_account = _accounts[0];
			
			_web3.eth.getBalance(_account, function (err, balance) {
				_accountData = {
					address: _account,
					balance: _web3.fromWei(balance, "ether").toNumber()
				};
				_this.emit('accountFetched');
			});

		    _rooExchange.deployed().then(function (instance) {
				_exchangeAddress = instance.address;
				_this.emit('addressFetched');
	   		});
		});

	}

	_updateOrderBooks(){
		let rooExchangeInstance;
		_rooExchange.deployed().then((instance) => {
	        rooExchangeInstance = instance;
        	return rooExchangeInstance.getSellOrderBook('ROO');
		}).then((book) => {

			_sellOrderBook = book[0].map((price, i)=>{
				return {
					'price': price.toNumber(),
					'volume': book[1][i].toNumber()
				};
			});
			console.log(_sellOrderBook);
			return rooExchangeInstance.getBuyOrderBook('ROO');
		}).then((book) => {
			_buyOrderBook = book[0].map((price, i)=>{
				return {
					'price': price.toNumber(),
					'volume': book[1][i].toNumber()
				};
			});
			this.emit('orderBookUpdated');
		}).catch((error) => {
			console.error("Can't fetch balance", error);
		});
	}

	getAddress(){
		return _exchangeAddress;
	}

	getAccountData(){
		return _accountData;
	}

	_updateTokenBalance(){
		let rooExchangeInstance;

		_rooExchange.deployed().then((instance) => {
	        rooExchangeInstance = instance;
        	return rooExchangeInstance.getBalance('ROO', { from : _account});
		}).then((balance) => {
			_tokenBalance = balance.toNumber();
        	return rooExchangeInstance.getEthBalanceInWei({ from : _account});
		}).then((balance) => {
			_etherBalance = balance.toNumber()/1000000000000000000;
			this.emit("balanceUpdated");
		}).catch((error) => {
			console.error("Can't fetch balance", error);
		});
	    
	}

	_watchExchangeEvents(){
		let rooExchangeInstance;

		_rooExchange.deployed().then((instance) => {
	        rooExchangeInstance = instance;
			
			rooExchangeInstance.allEvents({},{ fromBlock: 0, toBlock: 'latest'}).watch((error, result)=> {
				console.info(result.event, result.args);
			});

			rooExchangeInstance.DepositForTokenReceived({ from:_account },{ fromBlock: 0, toBlock: 'latest'}).watch((error, result)=> {
				this._updateTokenBalance();
			});

			rooExchangeInstance.WithdrawalToken({ from:_account },{ fromBlock: 0, toBlock: 'latest'}).watch((error, result)=> {
				this._updateTokenBalance();
			});

			rooExchangeInstance.DepositForEthReceived({ from:_account },{ fromBlock: 0, toBlock: 'latest'}).watch((error, result)=> {
				this._updateTokenBalance();
			});

			rooExchangeInstance.WithdrawalEth({ from:_account },{ fromBlock: 0, toBlock: 'latest'}).watch((error, result)=> {
				this._updateTokenBalance();
			});

			rooExchangeInstance.LimitSellOrderCreated({ from:_account },{ fromBlock: 0, toBlock: 'latest'}).watch((error, result)=> {
				if(_limitOrderEvents >= 3) _limitOrderEvents.pop();
				_limitOrderEvents.push({
					'title': result.event,
					'data': JSON.stringify(result.args)
				});
				this.emit('orderEvent');
				this._updateOrderBooks();
			});

			rooExchangeInstance.LimitBuyOrderCreated({ from:_account },{ fromBlock: 0, toBlock: 'latest'}).watch((error, result)=> {
				if(_limitOrderEvents >= 3) _limitOrderEvents.pop();
				_limitOrderEvents.push({
					'title': result.event,
					'data': JSON.stringify(result.args)
				});
				this.emit('orderEvent');
				this._updateOrderBooks();
			});

			rooExchangeInstance.BuyOrderFulfilled({ from:_account },{ fromBlock: 0, toBlock: 'latest'}).watch((error, result)=> {
				if(_fulfillOrderEvents >= 3) _limitOrderEvents.pop();
				_fulfillOrderEvents.push({
					'title': result.event,
					'data': JSON.stringify(result.args)
				});
				this.emit('orderEvent');
				this._updateOrderBooks();
			});

			rooExchangeInstance.SellOrderFulfilled({ from:_account },{ fromBlock: 0, toBlock: 'latest'}).watch((error, result)=> {
				if(_fulfillOrderEvents >= 3) _limitOrderEvents.pop();
				_fulfillOrderEvents.push({
					'title': result.event,
					'data': JSON.stringify(result.args)
				});
				this.emit('orderEvent');
				this._updateOrderBooks();
			});

		}).catch((error) => {
			console.error('Exchange watching events error', error);
		});
	}
	
	getTokenBalance=()=>{
		return _tokenBalance;
	}
	

	getEtherBalance=()=>{
		return _etherBalance;
	}

	getLimitOrderEvents=()=>{
		return _limitOrderEvents
	}

	getFulfillOrderEvents=()=>{
		return _fulfillOrderEvents
	}

	getBuyOrderBook=()=>{
		return _buyOrderBook;
	}

	getSellOrderBook=()=>{
		return _sellOrderBook;
	}

	depositEther = async(amount)=>{
		let rooExchangeInstance;
		let amt = parseInt(amount, 10);
		return _rooExchange.deployed().then((instance) => {
			rooExchangeInstance = instance;
			return rooExchangeInstance.depositEther({ from: _account, value: _web3.toWei(amt, "ether") });
		}).then(() => {
        	return this._updateTokenBalance()
		}).catch((error) => {
			console.error("Can't deposit ether", error);
		});
	}

	withdrawEther = async(amount)=>{
		let rooExchangeInstance;
		let amt = parseInt(amount, 10);
		return _rooExchange.deployed().then((instance) => {
			rooExchangeInstance = instance;
			console.log(amt);
			return rooExchangeInstance.withdrawEther(_web3.toWei(amt, "ether"), { from: _account});
		}).then(() => {
        	return this._updateTokenBalance()
		}).catch((error) => {
			console.error("Can't withdraw ether", error);
		});
	}

	depositToken = async(symbol, amount)=>{
		let rooExchangeInstance;
		let amt = parseInt(amount, 10);
		return _rooExchange.deployed().then((instance) => {
			rooExchangeInstance = instance;
			return rooExchangeInstance.depositToken(symbol, amt, { from: _account, gas: 4500000 })
		}).then(() => {
        	return this._updateTokenBalance()
		}).catch((error) => {
			console.error("Can't deposit token", error);
		});
	}

	withdrawToken = async(symbol, amount)=>{
		let rooExchangeInstance;
		let amt = parseInt(amount, 10);
		return _rooExchange.deployed().then((instance) => {
			rooExchangeInstance = instance;
			return rooExchangeInstance.withdrawToken(symbol, amt, { from: _account })
		}).then(() => {
        	return this._updateTokenBalance()
		}).catch((error) => {
			console.error("Can't withdraw token", error);
		});
	}
	
    addToken = async (tokenSymbol, tokenAddress)=>{
		return _rooExchange.deployed().then((instance) => {
			return instance.addToken(tokenSymbol, tokenAddress, { from: _account })
		}).catch((error) => {
			console.error("Can't add coin", error);
		});
	}

	sellToken = async(symbol, amount, price)=>{
		let rooExchangeInstance;
		let amt = parseInt(amount, 10);
		let prc = parseInt(price, 10);
		return _rooExchange.deployed().then((instance) => {
			rooExchangeInstance = instance;
			console.log(symbol);
			console.log(prc);
			console.log(amt);
			return rooExchangeInstance.sellToken(symbol, prc, amt,{ from: _account, gas:4000000});
		}).then(() => {
        	return this._updateTokenBalance()
		}).catch((error) => {
			console.error("Can't sell token", error);
		});
	}

	buyToken = async(symbol, amount, price)=>{
		let rooExchangeInstance;
		let amt = parseInt(amount, 10);
		let prc = parseInt(price, 10);
		return _rooExchange.deployed().then((instance) => {
			rooExchangeInstance = instance;
			return rooExchangeInstance.buyToken(symbol, prc, amt,{ from: _account, gas:4000000});
		}).then(() => {
        	return this._updateTokenBalance()
		}).catch((error) => {
			console.error("Can't buy token", error);
		});
	}
}

const rooExchangeService = new RooExchangeService()

export default rooExchangeService;