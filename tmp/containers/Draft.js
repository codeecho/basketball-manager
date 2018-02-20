import { connect } from 'react-redux';
import Draft from '../pages/Draft';
import {UNDRAFTED_TEAM_ID} from '../constants';

const mapStateToProps = (state, ownProps) => {
    
  const year = state.gameState.year;
  const players = state.players.filter(player => player.teamId === UNDRAFTED_TEAM_ID);

  return {
    year,
    players,
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


// WEBPACK FOOTER //
// src/containers/Draft.js