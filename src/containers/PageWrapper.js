import { connect } from 'react-redux';
import PageWrapper from '../pages/PageWrapper';

import { advance, endSeason } from '../actions';

const mapStateToProps = (state, ownProps) => {

  const {stage, logMessages, teamId} = state.gameState;

  return {
    stage,
    logMessages,
    teamId
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
      advance: () => dispatch(advance()),
      endSeason: () => dispatch(endSeason())
  };
};

const PageWrapperContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PageWrapper);

export default PageWrapperContainer;