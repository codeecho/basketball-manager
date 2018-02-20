import { connect } from 'react-redux';
import Player from '../pages/Player';
import { serverEvent, signFreeAgent, extendContract, releasePlayer } from '../actions';
import {GAME_STATE_CONTRACT_NEGOTIATIONS, FREE_AGENT_TEAM_ID} from '../constants';

const mapStateToProps = (state, ownProps) => {
    
  const {gameState, teams, players} = state;  
  
  const playerId = ownProps.match.params.id * 1;
  
  const player = players.find(player => player.id === playerId);
  
  const team = teams.find(team => team.id === player.teamId);
  
  const {stage, year} = gameState; 
  
  const isContractExpiring = stage === GAME_STATE_CONTRACT_NEGOTIATIONS && player.contractExpiry === year;
  
  const isUserPlayer = player.teamId === gameState.teamId;
  
  const isFreeAgent = player.teamId === FREE_AGENT_TEAM_ID;

  return {
    isContractExpiring,
    player,
    team,
    isUserPlayer,
    isFreeAgent
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