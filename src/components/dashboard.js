import React, { Component } from 'react';
import rooExchangeService from '../services/RooExchange'

class DashboardContainer extends Component {
	constructor(props) {
		super(props);

		this.updateBalance = this.updateBalance.bind(this);

		this.state = {
				tokenBalance: null,
				etherBalance: null,
				depositEther: {
					amount: '',
					hasChanges: false
				},
				withdrawEther:{
					amount: '',
					hasChanges: false
				},
				depositToken:{
					tokenSymbol: '',
					amount: '',
					hasChanges: false
				},
				withdrawToken:{
					tokenSymbol: '',
					amount: '',
					hasChanges: false
				}
		};
	}

	componentDidMount(){   
		this.updateBalance();
	  	rooExchangeService.on('balanceUpdated', this.updateBalance);
	}

	updateBalance(){
		const tokenBalance = rooExchangeService.getTokenBalance();
		const etherBalance = rooExchangeService.getEtherBalance();
	  	this.setState({ tokenBalance: tokenBalance, etherBalance: etherBalance });
	}

	handleDepositToken = async (event) => {
		event.preventDefault();
		await rooExchangeService.depositToken(this.state.depositToken.tokenSymbol, this.state.depositToken.amount);
		this.setState({
			depositToken: {
				tokenSymbol: '',
				amount: '',
				hasChanges: false
			}
		});
	}

	handleWithdrawToken = async (event) => {
		event.preventDefault();
		await rooExchangeService.withdrawToken(this.state.withdrawToken.tokenSymbol, this.state.withdrawToken.amount);
		this.setState({
			withdrawToken: {
				tokenSymbol: '',
				amount: '',
				hasChanges: false
			}
		});
	}

	handleDepositEther= async (event) => {
		event.preventDefault();
		await rooExchangeService.depositEther(this.state.depositEther.amount);
		this.setState({
			depositEther: {
				amount: '',
				hasChanges: false
			}
		});
	}

	handleWithdrawEther= async (event) => {
		event.preventDefault();
		await rooExchangeService.withdrawEther(this.state.withdrawEther.amount);
		this.setState({
			withdrawEther: {
				amount: '',
				hasChanges: false
			}
		});
	}


	handleInputChange = (form, event) =>  {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		let newFormState = this.state[form];
		newFormState[name] = value;
		newFormState.hasChanges = true;

		this.setState({
			[form]: newFormState
		});

		console.log(this.state);
	}

	render() {
			return (
				<div>
					<div className="pure-g">
						<div className="pure-u-1-1">
							<h1>RooExchange Overview</h1>
							{ (this.state.tokenBalance === null) ? <p>Token balance unknown</p>  :  <p>You currently have {this.state.tokenBalance} RooCoins in the exchange.</p> }
							{ (this.state.etherBalance === null) ? <p>Ether balance unknown</p>  :  <p>You currently have {this.state.etherBalance} Ether in the exchange.</p> }
						</div>
					</div>
					<div className="pure-g">
							<div className="pure-u-1-2">
								<form className="pure-form pure-form-aligned">
									<h2>Deposit Ether</h2>
									<fieldset>
										<div className="pure-control-group">
												<label htmlFor="amount">Amount in Ether</label>
												<input name="amount" type="text" placeholder="e.g. 77" 
													value={this.state.depositEther.amount} 
													onChange={this.handleInputChange.bind(this, 'depositEther')}
													/>
												<span className="pure-form-message-inline">This is a required field.</span>
										</div>
										<div className="pure-controls">
												<button type="submit" className="pure-button pure-button-primary" 
													onClick={this.handleDepositEther} disabled={!this.state.depositEther.hasChanges}>Deposit Ether</button>
										</div>
									</fieldset>
								</form>
							</div>
							
							<div className="pure-u-1-2">
								<form className="pure-form pure-form-aligned">
									<h2>Withdraw Ether</h2>
									<fieldset>
										<div className="pure-control-group">
												<label htmlFor="amount">Amount in Ether</label>
												<input name="amount" type="text" placeholder="e.g. 77" 
													value={this.state.withdrawEther.amount} 
													onChange={this.handleInputChange.bind(this, 'withdrawEther')}
													/>
												<span className="pure-form-message-inline">This is a required field.</span>
										</div>
										<div className="pure-controls">
												<button type="submit" className="pure-button pure-button-primary" 
													onClick={this.handleWithdrawEther} disabled={!this.state.withdrawEther.hasChanges}>Withdraw Ether</button>
										</div>
									</fieldset>
								</form>
							</div>
							
					</div>
					<div className="pure-g">
							<div className="pure-u-1-2">
								<form className="pure-form pure-form-aligned">
									<h2>Deposit Tokens</h2>
									<fieldset>
										<div className="pure-control-group">
												<label htmlFor="tokenSymbol">Token symbol</label>
												<input name="tokenSymbol" type="text" placeholder="e.g. ROO" 
													value={this.state.depositToken.tokenSymbol} 
													onChange={this.handleInputChange.bind(this, 'depositToken')}
													/>
												<span className="pure-form-message-inline">This is a required field.</span>
										</div>
										<div className="pure-control-group">
												<label htmlFor="amount">Amount</label>
												<input name="amount" type="text" placeholder="e.g. 500..." 
													value={this.state.depositToken.amount}
													onChange={this.handleInputChange.bind(this, 'depositToken')}
													/>
												<span className="pure-form-message-inline">This is a required field.</span>

												
										</div>
										<div className="pure-controls">
												<button type="submit" className="pure-button pure-button-primary" 
													onClick={this.handleDepositToken} disabled={!this.state.depositToken.hasChanges}>Deposit Token</button>
										</div>
									</fieldset>
								</form>
							</div>

							<div className="pure-u-1-2">
								<form className="pure-form pure-form-aligned">
									<h2>Withdraw Tokens</h2>
									<fieldset>
										<div className="pure-control-group">
												<label htmlFor="tokenSymbol">Token symbol</label>
												<input name="tokenSymbol" type="text" placeholder="e.g. ROO" 
													value={this.state.withdrawToken.tokenSymbol} 
													onChange={this.handleInputChange.bind(this, 'withdrawToken')}
													/>
												<span className="pure-form-message-inline">This is a required field.</span>
										</div>
										<div className="pure-control-group">
												<label htmlFor="amount">Amount</label>
												<input name="amount" type="text" placeholder="e.g. 500..." 
													value={this.state.withdrawToken.amount}
													onChange={this.handleInputChange.bind(this, 'withdrawToken')}
													/>
												<span className="pure-form-message-inline">This is a required field.</span>

												
										</div>
										<div className="pure-controls">
												<button type="submit" className="pure-button pure-button-primary" 
													onClick={this.handleWithdrawToken} disabled={!this.state.withdrawToken.hasChanges}>Withdraw Token</button>
										</div>
									</fieldset>
								</form>
							</div>
						</div>
				</div>
			);
  	}
}

export default DashboardContainer;