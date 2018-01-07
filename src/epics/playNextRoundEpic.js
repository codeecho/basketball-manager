import { Observable } from 'rxjs';
import * as actions from '../actions';
import Randomizer from '../utils/Randomizer';

import {toast} from 'react-toastify';

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
            const homeWin = randomizer.getRandomBoolean();
            
            const winnerId = homeWin ? fixture.homeId : fixture.awayId;
            const loserId = homeWin ? fixture.awayId: fixture.homeId;
            
            if(teamId === winnerId){
                const loser = teams.find(team => team.id === loserId);
                toast.success(` W - You defeated ${loser.name}`);
            }else if(teamId === loserId){
                const winner = teams.find(team => team.id === winnerId);
                toast.warning(` L - You lost to ${winner.name}`);
            }
            
            return {
               winnerId,
               loserId
            }
        });
        
        return Observable.of(actions.saveResults(results));
    });