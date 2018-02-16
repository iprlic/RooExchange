import { default as contract } from 'truffle-contract'
import { default as EventEmitter } from 'events'
import RooExchangeContract from '../../build/contracts/RooExchange.json'
import getWeb3 from '../utils/getWeb3'

let _web3;
let _accounts;
let _account;
let _tokenBalance;
let _etherBalance;
let _rooExchange = contract(RooExchangeContract);

class RooExchangeService extends EventEmitter{

	constructor() {
		super();
		getWeb3.then(results => {
			_web3 = results.web3;
      		// Instantiate contract once web3 provided.
      		this._instantiateContract();
	    	this._watchExchangeEvents();
	    })
	    .catch(() => {
      		console.log('Error finding web3.');
	    });
	}

	_instantiateContract(){
    	_rooExchange.setProvider(_web3.currentProvider);
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
		});

	}

	_watchExchangeEvents(){
		let rooExchangeInstance;

		_rooExchange.deployed().then((instance) => {
	        rooExchangeInstance = instance;
        	return rooExchangeInstance.allEvents({},{ fromBlock: 0, toBlock: 'latest'}).watch((error, result)=> {
				console.info(result.event, result.args);
			})
		}).catch((error) => {
			console.error('Exchange watching events error', error);
		});
    }
    
    addToken = async (tokenSymbol, tokenAddress)=>{
		return _rooExchange.deployed().then((instance) => {
			return instance.addToken(tokenSymbol, tokenAddress, { from: _account })
		}).catch((error) => {
			console.error("Can't add coin", error);
		});
	}


}

const rooExchangeService = new RooExchangeService()

export default rooExchangeService;