import './App.css'

import React, {Component} from 'react'

import { Provider } from 'react-redux';

import store from './store';

import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './containers/Home';
import Team from './containers/Team';
import Player from './containers/Player';
import Standings from './containers/Standings';

class App extends Component {
    
  render() {
      
    return (
        <Provider store={store}>
            <Router>
                <Switch>
                    <Route path="/" exact={true} render={(props) => <Home {...props} />} />
                    <Route path="/team/:id" exact={true} render={(props) => <Team {...props} />} />
                    <Route path="/player/:id" exact={true} render={(props) => <Player {...props} />} />
                    <Route path="/standings" exact={true} render={(props) => <Standings {...props} />} />
                    <Route component={() => <div>Page not found</div>} />
                </Switch>
            </Router>
        </Provider>
    );
    
  }
  
}

export default App
