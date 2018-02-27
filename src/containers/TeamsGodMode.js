import { connect } from 'react-redux';
import TeamsGodMode from '../pages/TeamsGodMode';

import TeamService from '../services/TeamService';

const teamService = new TeamService();

const mapStateToProps = (state, ownProps) => {

  const teams = state.teams.map(team => {
      const players = state.players.filter(player => player.teamId === team.id);
      const ratings = teamService.getSquadRatings(players);
      return Object.assign({}, team, {ratings});
  });

  return {
    teams
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  };
};

const TeamsGodModeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamsGodMode);

export default TeamsGodModeContainer;