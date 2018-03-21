import { connect } from 'react-redux';
import PageWrapper from '../pages/PageWrapper';

import { advance, endSeason, hostOnlineGame, joinOnlineGame, serverPlayerReady, newGame, setTradeProposal } from '../actions';

const mapStateToProps = (state, ownProps) => {

  const {gameState, onlineGame, options} = state;
  
  const {stage, logMessages, teamId, year, round} = gameState;
  
  const {isHost, users, playersReady} = onlineGame;
  
  const isOnlineGame = onlineGame.id !== undefined;
  const numberOfPlayers = users.length;
  const playersNotReady = isOnlineGame ? users.length - playersReady.length: 0;
  const waitingForPlayers = isOnlineGame ? playersNotReady > 0 : false;
  
  const canAdvance = !isOnlineGame ? true : (!isHost || playersNotReady === 1);
  
  const {draftType} = options;

  return {
    stage,
    logMessages,
    teamId,
    year,
    isOnlineGame,
    isHost,
    numberOfPlayers,
    playersReady: playersReady.length,
    playersNotReady,
    waitingForPlayers,
    onlineGame,
    canAdvance,
    draftType,
    round
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
      advance: (isOnlineGame, numberOfRounds, playThroughPlayoffs) => {
          if(isOnlineGame){
            dispatch(serverPlayerReady(numberOfRounds, playThroughPlayoffs));
          }else{
            dispatch(advance(numberOfRounds, playThroughPlayoffs));
          }
      },
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


// WEBPACK FOOTER //
// src/containers/PageWrapper.js