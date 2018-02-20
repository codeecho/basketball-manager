import { connect } from 'react-redux';
import Team from '../pages/Team';
import TeamService from '../services/TeamService';

const teamService = new TeamService();

const mapStateToProps = (state, ownProps) => {
    
  const teamId = ownProps.match.params.id * 1;
  
  const tab = ownProps.match.params.tab;
  
  const team = state.teams.find(team => team.id === teamId);
  
  const players = state.players.filter(player => player.teamId === teamId);
  
  const lineup = teamService.getLineup(players);
  
  const fixtures = state.fixtures.map(round => round.find(fixture => fixture.homeId === teamId || fixture.awayId === teamId));
  
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
    fixtures: decoratedFixtures
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