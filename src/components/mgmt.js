import React, { Component } from 'react';
import rooTokenService from '../services/RooToken'

class MgmtContainer extends Component {
	constructor(props) {
	    super(props);

	    this.updateBalance = this.updateBalance.bind(this);

	    this.state = {
      		tokenBalance : null
	    };
	}

	updateBalance(){
	  const balance = rooTokenService.getBalance();
	  this.setState({ tokenBalance: balance });
	}

	componentDidMount(){    
	  rooTokenService.on('balanceUpdated', this.updateBalance);
	}

	render() {
	    return (
	    	<h1>
	    	{(() => {
		        if (this.state.tokenBalance === null) {
		          	return ( "Token balance unknown" );
		        }else{
		        	return ( "You currently have " + this.state.tokenBalance + " tokens." );
		        }
		    })()}
	      	</h1>
	    );
  	}
}

export default MgmtContainer;