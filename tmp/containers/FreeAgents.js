import { connect } from 'react-redux';
import FreeAgents from '../pages/FreeAgents';

import {FREE_AGENT_TEAM_ID} from '../constants';

const mapStateToProps = (state, ownProps) => {

  const year = state.gameState.year;
  const players = state.players.filter(player => player.teamId === FREE_AGENT_TEAM_ID);
  players.sort((a,b) => b.expectedSalary - a.expectedSalary);

  return {
    players
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  };
};

const FreeAgentsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FreeAgents);

export default FreeAgentsContainer;


// WEBPACK FOOTER //
// src/containers/FreeAgents.js