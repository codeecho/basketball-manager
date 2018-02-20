import { connect } from 'react-redux';
import TradingBlock from '../pages/TradingBlock';
import stateSelector from '../utils/stateSelector';
import {setTradeProposal} from '../actions';

const mapStateToProps = (state, ownProps) => {
    const userPlayers = stateSelector.getUserPlayers(state);
    const players = state.players;
    const teams = stateSelector.getCPUTeams(state);
    
    return {
        userPlayers,
        players,
        teams
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
      negotiate: proposal => dispatch(setTradeProposal(proposal))
  };
};

const TradingBlockContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TradingBlock);

export default TradingBlockContainer;


// WEBPACK FOOTER //
// src/containers/TradingBlock.js