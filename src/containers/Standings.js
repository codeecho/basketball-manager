import { connect } from 'react-redux';
import Standings from '../pages/Standings';

const mapStateToProps = (state, ownProps) => {

  const standings = state.standings.map(standing => {
     const team = state.teams.find(team => team.id === standing.teamId);
     return Object.assign({}, standing, {team});
  });

  return {
    standings
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