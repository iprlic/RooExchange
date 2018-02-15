import React, { Component } from 'react'
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
  
  render() {
    return (
      <Router history={history}>
        <div className="App">
          <NavigationContainer />
          <main className="container">
                <div className="pure-g">
                   <div className="pure-u-1-1">
                    <Switch>
                      <Route exact path="/" render={() => <DashboardContainer />} />
                      <Route
                        path="/token-trading"
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
