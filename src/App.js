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
      <Router history={history} basename={'/roo-exchange'}>
        <div className="App">
          <NavigationContainer />
          <main className="container">
                    <Switch>
                      <Route exact path={ process.env.PUBLIC_URL + '/'} render={() => <DashboardContainer />} />
                      <Route
                        path={ process.env.PUBLIC_URL + '/token-trading'}
                        render={() => <TradingContainer  />}
                      />
                      <Route
                        path={ process.env.PUBLIC_URL + '/token-mgmt'}
                        render={() => <MgmtContainer  />}
                      />
                    </Switch>
          </main>
        </div>
      </Router>
    );
  }
}

export default App
