import { default as contract } from 'truffle-contract'
import { default as EventEmitter } from 'events'
import RooTokenContract from '../../build/contracts/RooToken.json'
import getWeb3 from '../utils/getWeb3'

let _balance = 0;
let _web3;
let _accounts;
let _account;
let _rooToken = contract(RooTokenContract);
let _tokenAddress;

class RooTokenService extends EventEmitter{

	constructor() {
		super();
		getWeb3.then(results => {
			_web3 = results.web3;
      		// Instantiate contract once web3 provided.
			this._instantiateContract();
			this._updateTokenBalance();
	    	this._watchTokenEvents();
	    })
	    .catch(() => {
      		console.log('Error finding web3.')
	    });
	}

	_instantiateContract(){
		const _this = this;
    	_rooToken.setProvider(_web3.currentProvider);
    	  // Get accounts.
	    _web3.eth.getAccounts((error, accs) => {
    		if (error != null) {
        		alert("There was an error fetching your accounts.");
         		return;
       		}

			if (accs.length === 0) {
				alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
			 	return;
			}

	       	_accounts = accs;
		   	_account = _accounts[0];

		   	_rooToken.deployed().then(function (instance) {
				_tokenAddress = instance.address;
				_this.emit('addressFetched');
			});

		});

	}

	getAddress(){
		return _tokenAddress;
	}

	_updateTokenBalance(){
		let rooTokenInstance;

		_rooToken.deployed().then((instance) => {
	        rooTokenInstance = instance;
        	return rooTokenInstance.balanceOf(_account);
		}).then((balance) => {
			_balance = balance.toNumber();
			this.emit("balanceUpdated");
		}).catch((error) => {
			console.error("Can't fetch balance", error);
		});
	    
	}

	_watchTokenEvents(){
		_rooToken.deployed().then((instance) => {
        	instance.allEvents({},{ fromBlock: 0, toBlock: 'latest'}).watch((error, result)=> {
				console.info(result.event, result.args);
			});

			instance.Transfer({ from:_account },{ fromBlock: 0, toBlock: 'latest'}).watch((error, result)=> {
				this._updateTokenBalance();
			});

			instance.Transfer({ to:_account },{ fromBlock: 0, toBlock: 'latest'}).watch((error, result)=> {
				this._updateTokenBalance();
			});
		});
	}

	getBalance(){
		return _balance;
	}

	sendToken = async (amount, reciever)=>{
		let rooTokenInstance;
		let amt = parseInt(amount, 10);
		return _rooToken.deployed().then((instance) => {
			rooTokenInstance = instance;
			return rooTokenInstance.transfer(reciever, amt, { from: _account })
		}).then(() => {
        	return this._updateTokenBalance();
		}).catch((error) => {
			console.error("Can't send token", error);
		});
	}

	allowanceToken  = async (amount, reciever)=>{
		let rooTokenInstance;
		let amt = parseInt(amount, 10);
		console.log(amount, amt);
		return _rooToken.deployed().then((instance) => {
			rooTokenInstance = instance;
			return rooTokenInstance.approve( reciever, amt, { from: _account })
		}).then(() => {
        	return this._updateTokenBalance()
		}).catch((error) => {
			console.error("Can't allow token", error);
		});

	}

}

const rooTokenService = new RooTokenService()

export default rooTokenService;