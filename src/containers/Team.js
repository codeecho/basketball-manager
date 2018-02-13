import { connect } from 'react-redux';
import Team from '../pages/Team';
import TeamService from '../services/TeamService';

const teamService = new TeamService();

const mapStateToProps = (state, ownProps) => {
    
  const teamId = ownProps.match.params.id * 1;
  
  const team = state.teams.find(team => team.id === teamId);
  
  const players = state.players.filter(player => player.teamId === teamId);
  
  const lineup = teamService.getLineup(players);
  
  console.log(lineup);

  return {
    team,
    players,
    ...lineup
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