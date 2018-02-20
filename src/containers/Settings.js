import { connect } from 'react-redux';
import Settings from '../pages/Settings';

import { hostOnlineGame, joinOnlineGame, newGame } from '../actions';

const mapStateToProps = (state, ownProps) => {
    
  return {

  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    newGame: () => dispatch(newGame()),
    hostOnlineGame: () => dispatch(hostOnlineGame()),
    joinOnlineGame: () => {
        const gameId = prompt('Please enter game id: ');
        dispatch(joinOnlineGame(gameId))
    }
  };
};

const SettingsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);

export default SettingsContainer;


// WEBPACK FOOTER //
// src/containers/Settings.js