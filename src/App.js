import './App.less'

import React, {Component} from 'react'

import { Provider } from 'react-redux';

import store from './store';

import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './containers/Home';
import Team from './containers/Team';
import Player from './containers/Player';
import Standings from './containers/Standings';
import FreeAgents from './containers/FreeAgents';
import Draft from './containers/Draft';

import { ToastContainer, toast } from 'react-toastify';

class App extends Component {
    
  render() {
      
    return (
        <Provider store={store}>
            <div>
                <Router>
                    <Switch>
                        <Route path="/" exact={true} render={(props) => <Home {...props} />} />
                        <Route path="/team/:id" exact={true} render={(props) => <Team {...props} />} />
                        <Route path="/player/:id" exact={true} render={(props) => <Player {...props} />} />
                        <Route path="/standings" exact={true} render={(props) => <Standings {...props} />} />
                        <Route path="/freeAgents" exact={true} render={(props) => <FreeAgents {...props} />} />
                        <Route path="/draft" exact={true} render={(props) => <Draft {...props} />} />
                        <Route component={() => <div>Page not found</div>} />
                    </Switch>
                </Router>
                <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} hideProgressBar={true} />
            </div>
        </Provider>
    );
    
  }
  
}

export default App
