import { connect } from 'react-redux';
import Player from '../pages/Player';
import { serverEvent, signFreeAgent, extendContract, releasePlayer } from '../actions';
import {GAME_STATE_CONTRACT_NEGOTIATIONS, FREE_AGENT_TEAM_ID} from '../constants';

const mapStateToProps = (state, ownProps) => {
    
  const {gameState, teams, players} = state;  
  
  const tab = ownProps.match.params.tab;
  
  const playerId = ownProps.match.params.id * 1;
  
  const player = players.find(player => player.id === playerId);
  
  const team = teams.find(team => team.id === player.teamId);
  
  const {stage, year} = gameState; 
  
  const isContractExpiring = stage === GAME_STATE_CONTRACT_NEGOTIATIONS && player.contractExpiry === year;
  
  const isUserPlayer = player.teamId === gameState.teamId;
  
  const isFreeAgent = player.teamId === FREE_AGENT_TEAM_ID;
  
  const playerRatings = state.playerRatings.find(x => x.playerId === playerId) || { games: 0, ppg: 0, apg: 0, rpg: 0};
  
  const playerRatingHistory = [];
  
  state.fixtures.forEach(round => {
      round.forEach(fixture => {
          if(!fixture.homePlayerRatings) return;
          const ratings = fixture.homePlayerRatings.concat(fixture.awayPlayerRatings).find(ratings => ratings.playerId === playerId);
          if(ratings) {
              const opponentId = [fixture.homeId, fixture.awayId].find(x => x !== player.teamId);
              const opponent = teams.find(team => team.id === opponentId);
              playerRatingHistory.push(Object.assign({}, ratings, {opponent}));
          }

      })
  })

  return {
    tab,
    isContractExpiring,
    player,
    team,
    isUserPlayer,
    isFreeAgent,
    playerRatings,
    playerRatingHistory
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const playerId = ownProps.match.params.id * 1;
  return {
      signFreeAgent: () => dispatch(serverEvent(signFreeAgent(playerId))),
      extendContract: () => dispatch(serverEvent(extendContract(playerId))),
      releasePlayer: () => dispatch(serverEvent(releasePlayer(playerId)))
  };
};

const PlayerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Player);

export default PlayerContainer;


// WEBPACK FOOTER //
// src/containers/Player.js