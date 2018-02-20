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
        const fixtures = state.fixtures.concat();
        
        let roundNo = state.gameState.round;
        
        results.forEach((roundResults, i) => {
            
            const round = fixtures[roundNo+i];
            
            roundResults.forEach(result => {
                const {fixtureId, winnerId, loserId, homeScore, awayScore} = result;
            
                const fixture = round.find(fixture => fixture.id === fixtureId);
                
                Object.assign(fixture, {winnerId, loserId, homeScore, awayScore});
                
                const winnerStanding = standings.find(standing => standing.teamId === winnerId);
                winnerStanding.played++;
                winnerStanding.won++;
                
                const loserStanding = standings.find(standing => standing.teamId === loserId);
                loserStanding.played++;
                loserStanding.lost++;
            });
            
        });
        
        standings.sort((a, b) => b.won - a.won);
        
        roundNo = roundNo + results.length;
        
        const stage = roundNo < state.fixtures.length ? GAME_STATE_REGULAR_SEASON : GAME_STATE_POST_SEASON;
        
        if(stage === GAME_STATE_POST_SEASON){
            const standing = standings.find(standing => standing.teamId === state.gameState.teamId);
            const position = standings.indexOf(standing) + 1;
            if(position > 0){
                toast.info(`You finished ${ordinal(position)}`);
            }
        }
        
        const gameState = Object.assign({}, state.gameState, { round: roundNo, stage });
        const newState = Object.assign({}, state, { standings, gameState, fixtures });
        
        this.persistenceService.saveGame(newState);
        
        return newState;
    }
    
}


// WEBPACK FOOTER //
// src/reducers/FixturesReducer.js