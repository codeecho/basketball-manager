import { connect } from 'react-redux';
import PageWrapper from '../pages/PageWrapper';

import { advance, endSeason, hostOnlineGame, joinOnlineGame, serverPlayerReady, newGame, setTradeProposal } from '../actions';

const mapStateToProps = (state, ownProps) => {

  const {gameState, onlineGame} = state;
  const {stage, logMessages, teamId, year} = gameState;
  const isOnlineGame = onlineGame.id !== undefined;

  return {
    stage,
    logMessages,
    teamId,
    year,
    isOnlineGame,
    onlineGame
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
      advance: () => {dispatch(advance())},
      playerReady: () => {dispatch(serverPlayerReady())},
      hostOnlineGame: () => dispatch(hostOnlineGame()),
      joinOnlineGame: () => {
          const gameId = prompt('Please enter game id: ');
          dispatch(joinOnlineGame(gameId))
      },
      newGame: () => dispatch(newGame()),
      trade: () => dispatch(setTradeProposal(undefined))
  };
};

const PageWrapperContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PageWrapper);

export default PageWrapperContainer;