import { connect } from 'react-redux';
import TradeNegotiations from '../pages/TradeNegotiations';
import stateSelector from '../utils/stateSelector';
import {serverEvent, completeTrade} from '../actions';

const mapStateToProps = (state, ownProps) => {
    const userPlayers = stateSelector.getUserPlayers(state);
    const players = state.players;
    const userTeam = stateSelector.getUserTeam(state);
    const teams = stateSelector.getCPUTeams(state);
    const proposal = state.gameState.tradeProposal;
    const salaryCap = state.options.salaryCap;
    
    return {
        userPlayers,
        players,
        userTeam,
        teams,
        proposal,
        salaryCap
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
      completeTrade: (trade) => dispatch(serverEvent(completeTrade(trade)))
  };
};

const TradeNegotiationsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TradeNegotiations);

export default TradeNegotiationsContainer;


// WEBPACK FOOTER //
// src/containers/TradeNegotiations.js