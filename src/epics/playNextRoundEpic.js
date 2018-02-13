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
    .switchMap(({seed}) => {
        
        const randomizer = new Randomizer(seed);
        
        const state = store.getState();
        const {gameState, teams} = state;
        const {teamId} = gameState;
        const fixtures = state.fixtures[state.gameState.round];
        
        const results = fixtures.map(fixture => {
            const {homeId, awayId} = fixture;
            
            const homeTeam = stateSelector.getTeam(state, homeId);
            const awayTeam = stateSelector.getTeam(state, awayId);

            const homePlayers = stateSelector.getTeamPlayers(state, homeId);
            const awayPlayers = stateSelector.getTeamPlayers(state, awayId);            
            
            const result = getResult(randomizer, homeTeam, awayTeam, homePlayers, awayPlayers);
            
            const {winner, loser} = result;
            
            if(teamId === winner.id){
                toast.success(` W - You defeated ${loser.name}`);
            }else if(teamId === loser.id){
                toast.warning(` L - You lost to ${winner.name}`);
            }
            
            return {
               winnerId: winner.id,
               loserId: loser.id
            }
        });
        
        return Observable.of(actions.saveResults(results));
    });
    
function getResult(randomizer, homeTeam, awayTeam, homePlayers, awayPlayers){
    
    const homeLineup = teamService.getLineup(homePlayers);
    const awayLineup = teamService.getLineup(awayPlayers);
    
    const homeRating = teamService.getLineupRating(homeLineup);
    const awayRating = teamService.getLineupRating(awayLineup);
    
    console.log(`${homeTeam.name}:${homeRating} v ${awayTeam.name}:${awayRating}`);
    
    const homeWin = randomizer.getRandomBoolean();
    
    const winner = homeWin ? homeTeam : awayTeam;
    const loser = homeWin ? awayTeam: homeTeam;
    
    return {
        winner,
        loser
    };
}