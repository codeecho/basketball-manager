import { connect } from 'react-redux';
import Home from '../pages/Home';

const mapStateToProps = (state, ownProps) => {
    
  const teamId = state.gameState.teamId;

  return {
    teamId
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  };
};

const HomeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);

export default HomeContainer;


// WEBPACK FOOTER //
// src/containers/Home.js