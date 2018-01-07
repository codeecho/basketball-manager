import { connect } from 'react-redux';
import Draft from '../pages/Draft';

const mapStateToProps = (state, ownProps) => {
    
  const players = state.draft;

  return {
    players
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