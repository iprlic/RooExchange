import React, { Component } from 'react';
import InfoColumnContainer from './infoColumn';
import rooExchangeService from '../services/RooExchange'


class TradingContainer extends Component {
	constructor(props) {
		super(props);

		this.updateOrderBooks = this.updateOrderBooks.bind(this);

		this.state = {
				buyOrderBook: [],
				sellOrderBook: [],
				buyToken: {
					amount: '',
					price: '',
					symbol: '',
					hasChanges: false
				},
				sellToken:{
					amount: '',
					price: '',
					symbol: '',
					hasChanges: false
				}
		};
	}

	componentDidMount(){   
		this.updateOrderBooks();

		rooExchangeService.on('orderBookUpdated', this.updateOrderBooks);
	}

	updateOrderBooks(){
		const buy = rooExchangeService.getBuyOrderBook();
		const sell = rooExchangeService.getSellOrderBook();
		console.log(buy);
		console.log(sell);

		this.setState({ buyOrderBook:buy, sellOrderBook: sell });
	}


	handleBuyToken = async (event) => {
		event.preventDefault();
		await rooExchangeService.buyToken(this.state.buyToken.symbol, this.state.buyToken.amount, this.state.buyToken.price);
		this.setState({
			buyToken: {
				amount: '',
				price: '',
				symbol: '',
				hasChanges: false
			},
		});
	}

	handleSellToken = async (event) => {
		event.preventDefault();
		await rooExchangeService.sellToken(this.state.sellToken.symbol, this.state.sellToken.amount, this.state.sellToken.price);
		this.setState({
			sellToken: {
				amount: '',
				price: '',
				symbol: '',
				hasChanges: false
			},
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
						<div className="pure-u-1">
							<h1>Roo token trading</h1>
						</div>
					</div>
					<div className="pure-g">
						<div className="pure-u-2-3">
							<div className="pure-g">
								<div className="pure-u-1-2">
									<form className="pure-form pure-form-aligned">
										<h2>Buy Token</h2>
										<fieldset>
											<div className="pure-control-group">
													<label htmlFor="symbol">Token Symbol</label>
													<input name="symbol" type="text" placeholder="e.g. ROO" 
														value={this.state.buyToken.symbol} 
														onChange={this.handleInputChange.bind(this, 'buyToken')}
														/>
											</div>
											<div className="pure-control-group">
													<label htmlFor="amount">Amount in Token</label>
													<input name="amount" type="text" placeholder="e.g. 100" 
														value={this.state.buyToken.amount}
														onChange={this.handleInputChange.bind(this, 'buyToken')}
														/>
											</div>
											<div className="pure-control-group">
													<label htmlFor="price">Price in Wei</label>
													<input name="price" type="text" placeholder="e.g. 9500000" 
														value={this.state.buyToken.price}
														onChange={this.handleInputChange.bind(this, 'buyToken')}
														/>
											</div>
											<div className="pure-controls">
													<button type="submit" className="pure-button pure-button-primary" 
														onClick={this.handleBuyToken} disabled={!this.state.buyToken.hasChanges}>Buy Token</button>
											</div>
										</fieldset>
									</form>
								</div>
								<div className="pure-u-1-2">
									<form className="pure-form pure-form-aligned">
										<h2>Sell Token</h2>
										<fieldset>
											<div className="pure-control-group">
													<label htmlFor="symbol">Token Symbol</label>
													<input name="symbol" type="text" placeholder="e.g. ROO" 
														value={this.state.sellToken.symbol} 
														onChange={this.handleInputChange.bind(this, 'sellToken')}
														/>
											</div>
											<div className="pure-control-group">
													<label htmlFor="amount">Amount in Token</label>
													<input name="amount" type="text" placeholder="e.g. 100" 
														value={this.state.sellToken.amount}
														onChange={this.handleInputChange.bind(this, 'sellToken')}
														/>
											</div>
											<div className="pure-control-group">
													<label htmlFor="price">Price in Wei</label>
													<input name="price" type="text" placeholder="e.g. 9500000" 
														value={this.state.sellToken.price}
														onChange={this.handleInputChange.bind(this, 'sellToken')}
														/>
											</div>
											<div className="pure-controls">
													<button type="submit" className="pure-button pure-button-primary" 
														onClick={this.handleSellToken} disabled={!this.state.sellToken.hasChanges}>Sell Token</button>
											</div>
										</fieldset>
									</form>
								</div>
							</div>

							<div className="pure-g">
								<div className="pure-u-1-2">
									<table className="pure-table">
											<thead>
													<tr>
															<th colSpan={2}>Bid</th>
													</tr>
											</thead>

											<tbody>
												{ this.state.buyOrderBook.map((sell, i) => (
														<tr key={i}>
														<td>
																{ sell.volume }
														</td>
														<td>
																@{ sell.price }
														</td>
														</tr>
												))}
											</tbody>
									</table>
								</div>
								<div className="pure-u-1-2">
									<table className="pure-table">
											<thead>
													<tr>
															<th colSpan={2}>Ask</th>
													</tr>
											</thead>

											<tbody>
											{ this.state.sellOrderBook.map((sell, i) => (
													<tr key={i}>
													<td>
															{ sell.volume }
													</td>
													<td>
															@{ sell.price }
													</td>
													</tr>
											))}
											</tbody>
									</table>
								</div>
							</div>
						</div>
						<InfoColumnContainer />
					</div>
				</div>
		
	    );
  	}
}

export default TradingContainer;