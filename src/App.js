import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'
import history from './utils/history';

import 'typeface-oswald'
import 'typeface-open-sans'
import 'purecss'
import './App.css'

import NavigationContainer from './components/navigation'
import MgmtContainer from './components/mgmt'
import TradingContainer from './components/trading'
import DashboardContainer from './components/dashboard'
import { Router, Route, Switch  } from 'react-router-dom';


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage.deployed().then((instance) => {
        simpleStorageInstance = instance

        // Stores a given value, 5 by default.
        return simpleStorageInstance.set(5, {from: accounts[0]})
      }).then((result) => {
        // Get the value from the contract to prove it worked.
        return simpleStorageInstance.get.call(accounts[0])
      }).then((result) => {
        // Update state with the result.
        return this.setState({ storageValue: result.c[0] })
      })
    })
  }

  render() {
    return (
      <Router history={history}>
        <div className="App">

          <NavigationContainer />
          <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="/" className="pure-menu-heading pure-menu-link">RooExchange</a>
          
          <ul className="pure-menu-list">
              <li className="pure-menu-item">
                <a href="/roo-trading" className="pure-menu-link">Roo Token Trading</a>
              </li>
              <li className="pure-menu-item">
                <a href="/token-mgmt" className="pure-menu-link">Token management</a>
              </li>
          </ul>
        </nav>

          <main className="container">
                <div className="pure-g">
                   <div className="pure-u-1-1">

                  <Switch>
                    <Route exact path="/" render={() => <DashboardContainer />} />
                    <Route
                      path="/roo-trading"
                      render={() => <TradingContainer  />}
                    />
                    <Route
                      path="/token-mgmt"
                      render={() => <MgmtContainer  />}
                    />
                  </Switch>
                  </div>
                </div>
          </main>
        </div>
      </Router>
    );
  }
}

export default App
