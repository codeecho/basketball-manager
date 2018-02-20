import { Observable } from 'rxjs';
import * as actions from '../actions';
import Randomizer from '../utils/Randomizer';
import stateSelector from '../utils/stateSelector';
import TeamService from '../services/TeamService';

import {toast} from 'react-toastify';

const teamService = new TeamService();

export const playNextRoundEpic = (action$, store) =>
  action$
    .filter(action => action.type === actions.PLAY_NEXT_ROUND)
    .debounceTime(0)
    .switchMap(({numberOfRounds, seed}) => {
        
        const randomizer = new Randomizer(seed);
        
        const state = store.getState();
        const {gameState, teams} = state;
        const {teamId} = gameState;
        
        const round = state.gameState.round;
        
        const results = [];
        
        for(let i=0; i < numberOfRounds; i++){
            const roundNo = round + i;
            
            if(state.fixtures.length <= roundNo) break;
            
            const fixtures = state.fixtures[roundNo];
            
            const roundResults = fixtures.map(fixture => {
                const {homeId, awayId, id} = fixture;
                
                const homeTeam = stateSelector.getTeam(state, homeId);
                const awayTeam = stateSelector.getTeam(state, awayId);
    
                const homePlayers = stateSelector.getTeamPlayers(state, homeId);
                const awayPlayers = stateSelector.getTeamPlayers(state, awayId);            
                
                const result = getResult(randomizer, homeTeam, awayTeam, homePlayers, awayPlayers);
                
                const {winner, loser, homeScore, awayScore} = result;
                
                if(teamId === winner.id){
                    toast.success(` W - ${loser.name} ${awayScore} - ${homeScore}`);
                }else if(teamId === loser.id){
                    toast.error(` L - ${winner.name} ${awayScore} - ${homeScore}`);
                }
                
                return {
                   fixtureId: id,
                   winnerId: winner.id,
                   loserId: loser.id,
                   homeScore,
                   awayScore
                }
            }); 
            
            results.push(roundResults);
        }
        
        return Observable.of(actions.saveResults(results));
    });
    
function getResult(randomizer, homeTeam, awayTeam, homePlayers, awayPlayers){
    
    const homeLineup = teamService.getLineup(homePlayers);
    const awayLineup = teamService.getLineup(awayPlayers);
    
    const homeRating = teamService.getLineupRating(homeLineup) + 1;
    const awayRating = teamService.getLineupRating(awayLineup);
    
    const adjustedHomeRating = Math.max(Math.pow(homeRating - 45, 3), 1);
    const adjustedAwayRating = Math.max(Math.pow(awayRating - 45, 3), 1);
    
    const chanceOfHomeWin = adjustedHomeRating / (adjustedHomeRating + adjustedAwayRating);
    
    const homeWin = randomizer.getRandomBoolean(chanceOfHomeWin);
    
    const isUpset = (homeWin && homeRating <= awayRating) || (!homeWin && homeRating >= awayRating);
    
    let margin = 1;
    
    if(isUpset){
        margin = randomizer.getRandomInteger(1, 5);
    }else{
        margin = Math.abs((0.5-chanceOfHomeWin)) * 60;
    }
    
    margin = Math.round(margin);
    
    margin = Math.max(margin, 1);
    
    const winner = homeWin ? homeTeam : awayTeam;
    const loser = homeWin ? awayTeam: homeTeam;
    
    const baseScore = randomizer.getRandomInteger(105, 115);
    
    const homeScore = homeWin ? baseScore + margin : baseScore - margin;
    const awayScore = (baseScore*2) - homeScore;
    
    return {
        winner,
        loser,
        homeScore,
        awayScore
    };
}


// WEBPACK FOOTER //
// src/epics/playNextRoundEpic.js