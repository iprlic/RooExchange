import React, { Component, Fragment } from 'react';
import rooTokenService from '../services/RooToken'

class MgmtContainer extends Component {
	constructor(props) {
	    super(props);

	    this.updateBalance = this.updateBalance.bind(this);

	    this.state = {
					tokenBalance : null,
					sendToken: {
						sendAmount: '',
						sendAddress: '',
						hasChanges: false
					},
					allowanceToken:{
						allowanceAmount: '',
						allowanceAddress: '',
						hasChanges: false
					}
	    };
	}

	updateBalance(){
	  const balance = rooTokenService.getBalance();
	  this.setState({ tokenBalance: balance });
	}

	componentDidMount(){   
		this.updateBalance();
	  rooTokenService.on('balanceUpdated', this.updateBalance);
	}

	handleSendToken = async (event) => {
		event.preventDefault();
		await rooTokenService.sendToken(this.state.sendToken.sendAmount, this.state.sendToken.sendAddress);
		this.setState({
			sendToken: {
				sendAmount: '',
				sendAddress: '',
				hasChanges: false
			}
		});
	}

	handleAllowanceToken = async (event) => {
		event.preventDefault();
		console.log(this.state);
		await rooTokenService.allowanceToken(this.state.allowanceToken.allowanceAmount, this.state.allowanceToken.allowanceAddress);
		this.setState({
			allowanceToken: {
				allowanceAmount: '',
				allowanceAddress: '',
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
							<h1>Manage RooCoin</h1>
								{ (this.state.tokenBalance === null) ? <p>Token balance unknown</p>  :  <p>You currently have {this.state.tokenBalance} RooCoins.</p> }
						</div>
					</div>
					<div className="pure-g">
							<div className="pure-u-1-2">
								<form className="pure-form pure-form-aligned">
									<h2>Send RooCoin</h2>
									<fieldset>
										<div className="pure-control-group">
												<label htmlFor="sendAmount">Amount in Token</label>
												<input name="sendAmount" type="text" placeholder="e.g. 77" 
													value={this.state.sendToken.sendAmount} 
													onChange={this.handleInputChange.bind(this, 'sendToken')}
													/>
												<span className="pure-form-message-inline">This is a required field.</span>
										</div>
										<div className="pure-control-group">
												<label htmlFor="sendAddress">To (address)</label>
												<input name="sendAddress" type="text" placeholder="e.g. 0x1d4c73585d48..." 
													value={this.state.sendToken.sendAddress}
													onChange={this.handleInputChange.bind(this, 'sendToken')}
													/>
												<span className="pure-form-message-inline">This is a required field.</span>

												
										</div>
										<div className="pure-controls">
												<button type="submit" className="pure-button pure-button-primary" 
													onClick={this.handleSendToken} disabled={!this.state.sendToken.hasChanges}>Send RooCoin</button>
										</div>
									</fieldset>
								</form>
							</div>
							<div className="pure-u-1-2">
								<form className="pure-form pure-form-aligned">
									<h2>Approve RooCoin Allowance</h2>
									<fieldset>
										<div className="pure-control-group">
												<label htmlFor="allowanceAmount">Amount in Token</label>
												<input name="allowanceAmount" type="text" placeholder="e.g. 77" 
													value={this.state.allowanceToken.allowanceAmount} 
													onChange={this.handleInputChange.bind(this, 'allowanceToken')}
													/>
												<span className="pure-form-message-inline">This is a required field.</span>
										</div>
										<div className="pure-control-group">
												<label htmlFor="allowanceAddress">To (address)</label>
												<input name="allowanceAddress" type="text" placeholder="e.g. 0x1d4c73585d48..." 
													value={this.state.allowanceToken.allowanceAddress}
													onChange={this.handleInputChange.bind(this, 'allowanceToken')}
													/>
												<span className="pure-form-message-inline">This is a required field.</span>
										</div>
										<div className="pure-controls">
												<button type="submit" className="pure-button pure-button-primary" 
													onClick={this.handleAllowanceToken} disabled={!this.state.allowanceToken.hasChanges}>Allow RooCoin to be used</button>
										</div>
									</fieldset>
								</form>
							</div>
					</div>
				</div>
	    );
  	}
}

export default MgmtContainer;