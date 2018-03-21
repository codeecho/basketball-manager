import { connect } from 'react-redux';
import DraftPicks from '../pages/tabs/DraftPicks';
import TeamService from '../services/TeamService';

const teamService = new TeamService();

const mapStateToProps = (state, ownProps) => {
    
  const teamId = ownProps.match.params.id * 1;
  
  const year = state.gameState.year;
  
  const draftPicks = teamService.getDraftPicks(teamId, year, 7, state.tradedPicks);

  return {
    draftPicks
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  };
};

const DraftPicksContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DraftPicks);

export default DraftPicksContainer;