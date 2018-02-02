import { connect } from 'react-redux';
import Player from '../pages/Player';
import { signFreeAgent, extendContract, releasePlayer } from '../actions';
import {GAME_STATE_CONTRACT_NEGOTIATIONS} from '../constants';

const mapStateToProps = (state, ownProps) => {
    
  const {gameState, teams, players} = state;  
  
  const playerId = ownProps.match.params.id * 1;
  
  const player = players.find(player => player.id === playerId);
  
  const team = teams.find(team => team.id === player.teamId);
  
  const {stage, year} = gameState; 
  
  const isContractExpiring = stage === GAME_STATE_CONTRACT_NEGOTIATIONS && player.contractExpiry === year;

  return {
    isContractExpiring,
    player,
    team
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const playerId = ownProps.match.params.id * 1;
  return {
      signFreeAgent: () => dispatch(signFreeAgent(playerId)),
      extendContract: () => dispatch(extendContract(playerId)),
      releasePlayer: () => dispatch(releasePlayer(playerId))
  };
};

const PlayerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Player);

export default PlayerContainer;