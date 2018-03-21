import { connect } from 'react-redux';
import Standings from '../pages/Standings';

const mapStateToProps = (state, ownProps) => {

    const {gameState, teams, options} = state;

  const {playoffType} = options;

  const standings = state.standings.map(standing => {
     const team = teams.find(team => team.id === standing.teamId);
     return Object.assign({}, standing, {team});
  });
  
  const otherUserTeamIds = state.onlineGame.users.map(user => user.teamId);
  
  const {teamId} = gameState;
  
  const tab = ownProps.match.params.tab;
  
  const playerRatings = state.playerRatings.map(ratings => {
      const player = state.players.find(player => player.id === ratings.playerId);
      return Object.assign({}, player, {ratings});
  });
  
  const players = state.players;
  
  const playoffs = state.playoffs.map(round => {
      return round.map(fixture => {
          const homeTeam = state.teams.find(team => team.id === fixture.homeId);
          const awayTeam = state.teams.find(team => team.id === fixture.awayId);
          return Object.assign({}, fixture, {homeTeam, awayTeam});
      })
  });
  
  const champions = state.champions.map(champion => {
      const team = state.teams.find(team => team.id === champion.teamId);
      return Object.assign({}, champion, {team});
  });
  champions.sort((a,b) => b.year - a.year);

  return {
    tab,
    standings,
    teamId,
    otherUserTeamIds,
    players,
    playerRatings,
    playoffs,
    playoffType,
    champions
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