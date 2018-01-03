import { Observable } from 'rxjs';
import * as actions from '../actions';
import Randomizer from '../utils/Randomizer';

export const playNextRoundEpic = (action$, store) =>
  action$
    .filter(action => action.type === actions.PLAY_NEXT_ROUND)
    .debounceTime(0)
    .switchMap(({seed}) => {
        
        const randomizer = new Randomizer(seed);
        
        const state = store.getState();
        const fixtures = state.fixtures[state.gameState.round];
        
        const results = fixtures.map(fixture => {
            const homeWin = randomizer.getRandomBoolean();
            return {
                winnerId: homeWin ? fixture.homeId : fixture.awayId,
                loserId: homeWin ? fixture.awayId: fixture.homeId
            }
        });
        
        return Observable.of(actions.saveResults(results));
    });