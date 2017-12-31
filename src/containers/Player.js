import { connect } from 'react-redux';
import Player from '../pages/Player';

const mapStateToProps = (state, ownProps) => {
    
  const playerId = ownProps.match.params.id * 1;
  
  const player = state.players.find(player => player.id === playerId);
  const team = state.teams.find(team => team.id === player.teamId);

  return {
    player,
    team
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  };
};

const PlayerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Player);

export default PlayerContainer;