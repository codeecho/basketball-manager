import 'typeface-roboto'
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
import TradingBlock from './containers/TradingBlock';
import TradeNegotiations from './containers/TradeNegotiations';
import Fixture from './containers/Fixture';
import Settings from './containers/Settings';
import LoadGame from './pages/LoadGame';

import TeamsGodMode from './containers/TeamsGodMode';

import { ToastContainer, toast } from 'react-toastify';
import ModalWrapper from './components/ModalWrapper';
import ConfirmModal from './components/ConfirmModal';

class App extends Component {
    
  render() {
      
    return (
        <Provider store={store}>
            <div>
                <Router>
                    <Switch>
                        <Route path="/" exact={true} render={(props) => <Home {...props} />} />
                        <Route path="/team/:id/:tab" exact={true} render={(props) => <Team {...props} />} />
                        <Route path="/team/:id" exact={true} render={(props) => <Team {...props} />} />
                        <Route path="/player/:id/:tab" exact={true} render={(props) => <Player {...props} />} />                        
                        <Route path="/player/:id" exact={true} render={(props) => <Player {...props} />} />
                        <Route path="/standings/:tab" exact={true} render={(props) => <Standings {...props} />} />                        
                        <Route path="/standings" exact={true} render={(props) => <Standings {...props} />} />
                        <Route path="/freeAgents" exact={true} render={(props) => <FreeAgents {...props} />} />
                        <Route path="/draft" exact={true} render={(props) => <Draft {...props} />} />
                        <Route path="/tradingBlock" exact={true} render={(props) => <TradingBlock {...props} />} />                        
                        <Route path="/trade" exact={true} render={(props) => <TradeNegotiations {...props} />} />                         
                        <Route path="/fixture/:round/:id" exact={true} render={(props) => <Fixture {...props} />} />                                                 
                        <Route path="/settings" exact={true} render={(props) => <Settings {...props} />} />                                                 
                        <Route path="/teams/god" exact={true} render={(props) => <TeamsGodMode {...props} />} />                                                                         
                        <Route path="/load" exact={true} render={(props) => <LoadGame {...props} />} />                                                                         
                        <Route component={() => <div>Page not found</div>} />
                    </Switch>
                </Router>
                <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} hideProgressBar={true} />
                <ModalWrapper />
                <ConfirmModal />
            </div>
        </Provider>
    );
    
  }
  
}

export default App



// WEBPACK FOOTER //
// src/App.js