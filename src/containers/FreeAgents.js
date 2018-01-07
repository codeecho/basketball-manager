import { connect } from 'react-redux';
import FreeAgents from '../pages/FreeAgents';

const mapStateToProps = (state, ownProps) => {
    
  const players = state.players.filter(player => !player.teamId);
  const year = state.gameState.year;

  return {
    players,
    year
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