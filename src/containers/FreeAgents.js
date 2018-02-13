import { connect } from 'react-redux';
import FreeAgents from '../pages/FreeAgents';

const mapStateToProps = (state, ownProps) => {

  const year = state.gameState.year;
  const players = state.players.filter(player => !player.teamId && player.draftYear < year);
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