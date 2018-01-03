import { connect } from 'react-redux';
import GameSetup from '../pages/GameSetup';
import { loadDemoData, setTeam } from '../actions';

const mapStateToProps = (state, ownProps) => {

  const {gameState, teams} = state;
  const {teamId} = gameState;

  return {
      teams,
      teamId
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
      loadDemoData: () => dispatch(loadDemoData()),
      setTeam: (teamId, username) => dispatch(setTeam(teamId, username))
  };
};

const GameSetupContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GameSetup);

export default GameSetupContainer;