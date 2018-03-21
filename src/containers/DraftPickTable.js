import { connect } from 'react-redux';
import DraftPickTable from '../components/DraftPickTable';

const mapStateToProps = (state, ownProps) => {
  
  const draftPicks = ownProps.draftPicks.map(draftPick => {
        if(!draftPick.acquired) return draftPick;
        const team = state.teams.find(team => team.id === draftPick.teamId);
        return Object.assign({}, draftPick, {team});
    });
    
    draftPicks.sort((a, b) => a.year - b.year);

  return {
    draftPicks
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  };
};

const DraftPickTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DraftPickTable);

export default DraftPickTableContainer;