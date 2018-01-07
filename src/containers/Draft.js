import { connect } from 'react-redux';
import Draft from '../pages/Draft';

const mapStateToProps = (state, ownProps) => {
    
  const players = state.draft;
  const year = state.gameState.year;

  return {
    players,
    year
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  };
};

const DraftContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Draft);

export default DraftContainer;