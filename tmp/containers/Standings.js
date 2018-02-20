import { connect } from 'react-redux';
import Standings from '../pages/Standings';

const mapStateToProps = (state, ownProps) => {

    const {gameState, teams} = state;

  const standings = state.standings.map(standing => {
     const team = teams.find(team => team.id === standing.teamId);
     return Object.assign({}, standing, {team});
  });
  
  const otherUserTeamIds = state.onlineGame.users.map(user => user.teamId);
  
  const {teamId} = gameState;

  return {
    standings,
    teamId,
    otherUserTeamIds
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  };
};

const StandingsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Standings);

export default StandingsContainer;


// WEBPACK FOOTER //
// src/containers/Standings.js