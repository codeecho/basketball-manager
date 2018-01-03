import { connect } from 'react-redux';
import PageWrapper from '../pages/PageWrapper';

import { advance, endSeason, hostOnlineGame, joinOnlineGame, serverPlayerReady, newGame } from '../actions';

const mapStateToProps = (state, ownProps) => {

  const {gameState, onlineGame} = state;
  const {stage, logMessages, teamId} = gameState;
  const isOnlineGame = onlineGame.id !== undefined;

  return {
    stage,
    logMessages,
    teamId,
    isOnlineGame,
    onlineGame
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
      advance: () => {dispatch(advance())},
      playerReady: () => {dispatch(serverPlayerReady())},
      endSeason: () => dispatch(endSeason()),
      hostOnlineGame: () => dispatch(hostOnlineGame()),
      joinOnlineGame: () => {
          const gameId = prompt('Please enter game id: ');
          dispatch(joinOnlineGame(gameId))
      },
      newGame: () => dispatch(newGame())
  };
};

const PageWrapperContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PageWrapper);

export default PageWrapperContainer;