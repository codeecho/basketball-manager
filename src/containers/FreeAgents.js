import { connect } from 'react-redux';
import FreeAgents from '../pages/FreeAgents';

const mapStateToProps = (state, ownProps) => {
    
  const freeAgents = state.players.filter(player => !player.teamId);

  return {
    freeAgents
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