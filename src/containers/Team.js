import { connect } from 'react-redux';
import Team from '../pages/Team';
import TeamService from '../services/TeamService';

const teamService = new TeamService();

const mapStateToProps = (state, ownProps) => {
    
  const teamId = ownProps.match.params.id * 1;
  
  const tab = ownProps.match.params.tab;
  
  const team = state.teams.find(team => team.id === teamId);
  
  const players = state.players.filter(player => player.teamId === teamId)
    .map(player => {
        const ratings = state.playerRatings.find(ratings => ratings.playerId === player.id) || {games: 0, ppg: 0, apg: 0, rpg: 0};
        return Object.assign({}, player, {ratings});
    });
  
  const lineup = teamService.getLineup(players);
  
  const lineupRatings = teamService.getLineupRatings(lineup);
  
  const fixtures = state.fixtures.map(round => round.find(fixture => fixture.homeId === teamId || fixture.awayId === teamId)).filter(fixture => !!fixture);
  
  const decoratedFixtures = fixtures.map(fixture => {
    const {homeId, awayId} = fixture;
    const homeTeam = state.teams.find(team => team.id === homeId);
    const awayTeam = state.teams.find(team => team.id === awayId);    
    return Object.assign({}, fixture, {homeTeam, awayTeam});
  });

  return {
    tab,
    team,
    players,
    ...lineup,
    fixtures: decoratedFixtures,
    lineupRatings
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  };
};

const TeamContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Team);

export default TeamContainer;


// WEBPACK FOOTER //
// src/containers/Team.js