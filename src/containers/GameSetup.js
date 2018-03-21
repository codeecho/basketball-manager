import { connect } from 'react-redux';
import GameSetup from '../pages/GameSetup';
import { loadTestData, loadDemoData, loadBBLData, setTeam } from '../actions';

const mapStateToProps = (state, ownProps) => {

  const {gameState} = state;
  const teams = state.teams && state.teams.concat();
  if(teams) teams.sort((a,b) => a.name.localeCompare(b.name));
  const {teamId} = gameState;

  return {
      teams,
      teamId
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
      loadTestData: () => dispatch(loadTestData()),
      loadDemoData: () => dispatch(loadDemoData()),
      loadBBLData: () => dispatch(loadBBLData()),
      setTeam: (teamId, username) => dispatch(setTeam(teamId, username))
  };
};

const GameSetupContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GameSetup);

export default GameSetupContainer;


// WEBPACK FOOTER //
// src/containers/GameSetup.js