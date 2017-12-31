import { Observable } from 'rxjs';
import * as actions from '../actions';
import Randomizer from '../utils/Randomizer';

const randomizer = new Randomizer();

export const advanceEpic = (action$, store) =>
  action$
    .filter(action => action.type === actions.ADVANCE)
    .debounceTime(500)
    .switchMap(() => {
        const state = store.getState();
        const fixtures = state.fixtures[state.gameState.round];
        
        const results = fixtures.map(fixture => {
            const homeWin = randomizer.getBoolean();
            return {
                winnerId: homeWin ? fixture.homeId : fixture.awayId,
                loserId: homeWin ? fixture.awayId: fixture.homeId
            }
        });
        
        return Observable.of(actions.saveResults(results));
    });