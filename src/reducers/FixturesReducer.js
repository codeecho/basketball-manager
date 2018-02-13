import PersistenceService from '../services/PersistenceService';

import {toast} from 'react-toastify';

import ordinal from 'ordinal'

import { GAME_STATE_REGULAR_SEASON, GAME_STATE_POST_SEASON } from '../constants';

export default class FixturesReducer{
    
    constructor(){
        this.persistenceService = new PersistenceService();
    }
    
    saveResults(action, state){
        const {results} = action;
        const standings = state.standings.concat();
        
        results.forEach(result => {
            const winnerStanding = standings.find(standing => standing.teamId === result.winnerId);
            winnerStanding.played++;
            winnerStanding.won++;
            const loserStanding = standings.find(standing => standing.teamId === result.loserId);
            loserStanding.played++;
            loserStanding.lost++;
        });
        
        standings.sort((a, b) => b.won - a.won);
        
        const round = state.gameState.round + 1;
        
        const stage = round < state.fixtures.length ? GAME_STATE_REGULAR_SEASON : GAME_STATE_POST_SEASON;
        
        if(stage === GAME_STATE_POST_SEASON){
            const standing = standings.find(standing => standing.teamId === state.gameState.teamId);
            const position = standings.indexOf(standing) + 1;
            toast.info(`You finished ${ordinal(position)}`);
        }
        
        const gameState = Object.assign({}, state.gameState, { round, stage });
        const newState = Object.assign({}, state, { standings, gameState });
        
        this.persistenceService.saveGame(newState);
        
        return newState;
    }
    
}