import { connect } from 'react-redux';
import TradeNegotiations from '../pages/TradeNegotiations';
import stateSelector from '../utils/stateSelector';
import {serverEvent, completeTrade} from '../actions';
import TeamService from '../services/TeamService';

const teamService = new TeamService();

const mapStateToProps = (state, ownProps) => {
    const canTrade = true;
    const userPlayers = stateSelector.getUserPlayers(state);
    const players = state.players;
    const userTeam = stateSelector.getUserTeam(state);
    const userDraftPicks = teamService.getDraftPicks(userTeam.id, state.gameState.year, 4, state.tradedPicks);
    const teams = stateSelector.getCPUTeams(state).concat();
    teams.sort((a,b) => a.name.localeCompare(b.name));
    const proposal = state.gameState.tradeProposal;
    const salaryCap = state.options.salaryCap;
    
    return {
        canTrade,
        userPlayers,
        players,
        userTeam,
        userDraftPicks,
        teams,
        proposal,
        salaryCap,
        year: state.gameState.year,
        tradedPicks: state.tradedPicks
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