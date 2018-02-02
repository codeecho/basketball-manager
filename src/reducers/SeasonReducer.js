import stateModifier from './modifiers/stateModifier';
import Randomizer from '../utils/Randomizer';
import DraftService from '../services/DraftService';
import PlayerService from '../services/PlayerService';
import {toast} from 'react-toastify';
import { GAME_STATE_REGULAR_SEASON, GAME_STATE_POST_SEASON, GAME_STATE_END_OF_SEASON, 
    GAME_STATE_CONTRACT_NEGOTIATIONS, GAME_STATE_FREE_AGENCY, GAME_STATE_DRAFT } from '../constants';

export default class SeasonReducer{
    
    constructor(){
        this.draftService = new DraftService();
        this.playerService = new PlayerService();
    }
    
    handleExpiringContracts(action, state){
        const team = state.teams.find(team => team.id === state.gameState.teamId);
        const playersWithExpiringContracts = state.players.filter(player => player.teamId === state.gameState.teamId && player.contractExpiry === state.gameState.year);
        
        playersWithExpiringContracts.forEach(player => toast.info(`${player.name}'s contract is expiring`));
        
        const stage = GAME_STATE_CONTRACT_NEGOTIATIONS;
        const gameState = Object.assign({}, state.gameState, {stage});
        return Object.assign({}, state, {gameState});
    }
    
    applyTraining(action, state){
        return Object.assign(
            {}, 
            state, 
            stateModifier.modifyPlayers(state, player => {
                const originalAbility = player.ability;
                const realDelta = this.playerService.calculateTrainingAdjustment(player);
                const realAbility = player.realAbility + realDelta;
                const ability = Math.floor(realAbility);
                const delta = ability - originalAbility;
                const expectedSalary = this.playerService.calculateExpectedSalary(Object.assign({}, player, {delta, ability, realAbility}));
                return { delta, ability, realAbility, expectedSalary };
            })
        );
    }
    
    doDraft(action, state){
        const {seed} = action;
        const {year, teamId} = state.gameState;
        let draft = state.draft.concat();
        const players = state.players.concat();
        const standings = state.standings.concat();
        standings.sort((a, b) => a.won - b.won);
        standings.forEach((standing, i) => {
            const player = draft[i];
            player.teamId = standing.teamId;
            player.contractExpiry = year+3;
            players.push(player);
            if(player.teamId === teamId) toast.info(`You drafted ${player.name} in the 1st round of the draft`);
        });
        draft = draft.slice(standings.length);
        standings.forEach((standing, i) => {
            const player = draft[i];
            player.teamId = standing.teamId;
            player.contractExpiry = year+3;
            players.push(player);
            if(player.teamId === teamId) toast.info(`You drafted ${player.name} in the 2nd round of the draft`);
        });
        const randomizer = new Randomizer(seed);
        const draftService = new DraftService(randomizer);
        draft = draftService.createDraftClass(state.gameState.year, state.nextPlayerId, state.teams.length*2);
        const nextPlayerId = state.nextPlayerId + draft.length;
        const stage = GAME_STATE_DRAFT;
        const gameState = Object.assign({}, state.gameState, {stage});
        return Object.assign({}, state, {gameState, players, draft, nextPlayerId});
    }
    
    createFreeAgents(action, state){
        const year = state.gameState.year;
        const players = state.players.map(player => {
            if(player.contractExpiry !== year) return player;
            
            if(player.teamId == state.gameState.teamId) toast.info(`${player.name} is now a free agent`);
            
            return Object.assign({}, player, {teamId: undefined});
        });
        const stage = GAME_STATE_FREE_AGENCY;
        const gameState = Object.assign({}, state.gameState, {stage});
        return Object.assign({}, state, {gameState, players});
    }
    
    aiSignFreeAgents(action, state){
        const stage = GAME_STATE_END_OF_SEASON;
        const gameState = Object.assign({}, state.gameState, {stage});
        return Object.assign({}, state, {gameState});
    }
    
    endSeason(action, state){
        const round = 0;
        const stage = GAME_STATE_REGULAR_SEASON;
        const year = state.gameState.year + 1;
        
        const gameState = Object.assign({}, state.gameState, { round, stage, year});
        
        const standings = state.standings.map(standing => Object.assign({}, standing, {played: 0, won: 0, lost: 0}));
        
        return Object.assign(
            {}, 
            state,
            stateModifier.modifyGameState(state, { round, stage, year }),
            stateModifier.modifyStandings(state, () => ({played: 0, won: 0, lost: 0})),
            stateModifier.modifyPlayers(state, player => ({ age: year - player.dob -1 }))
        );
    }
    
}