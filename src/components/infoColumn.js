import React, { Component } from 'react';
import rooExchangeService from '../services/RooExchange'
import rooTokenService from '../services/RooToken'

class InfoColumnContainer extends Component {
	constructor(props) {
	    super(props);

        this.updateBalance = this.updateBalance.bind(this);
        this.updateOrderEvents = this.updateOrderEvents.bind(this);
        this.updateInfoData = this.updateInfoData.bind(this);

        this.state = {
            rooExchangeAddress: null,
            rooTokenAddress: null,
            accountData: {
                address: null,
                balance: null
            },
            tokenBalance: null,
            etherBalance: null,
            limitOrderEvents: [],
            fulfillOrderEvents: []
        }
    }

    componentDidMount(){   
        this.updateBalance();
        this.updateOrderEvents();
        this.updateInfoData();

        rooExchangeService.on('balanceUpdated', this.updateBalance);
        rooExchangeService.on('orderEvent', this.updateOrderEvents);

        rooExchangeService.on('addressFetched', this.updateInfoData);
        rooExchangeService.on('accountFetched', this.updateInfoData);

        rooTokenService.on('addressFetched', this.updateInfoData);
    }

    updateInfoData(){
        this.setState({ rooTokenAddress: rooTokenService.getAddress() });
        this.setState({ rooExchangeAddress: rooExchangeService.getAddress() });
        this.setState({ accountData: rooExchangeService.getAccountData() });
    }

	updateBalance(){
		const tokenBalance = rooExchangeService.getTokenBalance();
		const etherBalance = rooExchangeService.getEtherBalance();
	  	this.setState({ tokenBalance: tokenBalance, etherBalance: etherBalance });
    }
    
    updateOrderEvents(){
        const limitOrderEvents = rooExchangeService.getLimitOrderEvents();
		const fulfillOrderEvents = rooExchangeService.getFulfillOrderEvents();
	  	this.setState({ limitOrderEvents: limitOrderEvents, fulfillOrderEvents: fulfillOrderEvents });
	}

    render() {
	    return (
            <div className="pure-u-1-3">
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th colSpan={2}>Info</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>RooCoin address</td>
                            <td>{ this.state.rooTokenAddress }</td>
                        </tr>
                        <tr>
                            <td>RooExchange address</td>
                            <td>{ this.state.rooExchangeAddress }</td>
                        </tr>
                        <tr>
                            <td>Current account</td>
                            <td>{ this.state.accountData.address }</td>
                        </tr>
                        <tr>
                            <td>Current account balance</td>
                            <td>{ this.state.accountData.balance }</td>
                        </tr>
                    </tbody>
                </table>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th colSpan={2}>Your assets</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>RooCoin</td>
                            <td>{ this.state.tokenBalance }</td>
                        </tr>

                        <tr>
                            <td>Ether</td>
                            <td>{ this.state.etherBalance }</td>
                        </tr>
                    </tbody>
                </table>

                <table className="pure-table">
                    <thead>
                        <tr>
                            <th colSpan={2}>Limit orders</th>
                        </tr>
                    </thead>
                    <tbody>
                    { this.state.limitOrderEvents.map((order, i) => (
                        <tr key={i}>
                        <td>
                            { order.title }
                        </td>
                        <td>
                            { order.data }
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <table className="pure-table">
                    <thead>
                        <tr>
                            <th colSpan={2}>Order fulfillment</th>
                        </tr>
                    </thead>
                    <tbody>
                    { this.state.fulfillOrderEvents.map((order, i) => (
                        <tr key={i}>
                        <td>
                            { order.title }
                        </td>
                        <td>
                            { order.data }
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
	    );
  	}
}

export default InfoColumnContainer;