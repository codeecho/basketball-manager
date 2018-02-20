import { connect } from 'react-redux';
import PlayerTable from '../components/PlayerTable';

const mapStateToProps = (state, ownProps) => {
    
    const {year, stage} = state.gameState;

  return {
    year,
    stage
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  };
};

const PlayerTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayerTable);

export default PlayerTableContainer;


// WEBPACK FOOTER //
// src/containers/PlayerTable.js