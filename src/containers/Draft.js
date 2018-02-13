import { connect } from 'react-redux';
import Draft from '../pages/Draft';

const mapStateToProps = (state, ownProps) => {
    
  const year = state.gameState.year;
  const players = state.players.filter(player => player.draftYear === year);

  return {
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