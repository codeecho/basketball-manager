import { Observable } from 'rxjs';
import * as actions from '../actions';

export const advanceEpic = (action$, store) =>
  action$
    .filter(action => action.type === actions.ADVANCE)
    .debounceTime(500)
    .switchMap(() => {
        const state = store.getState();
        const fixtures = state.fixtures[state.gameState.round];
        
        const results = fixtures.map(fixture => {
            return {
                winnerId: fixture.homeId,
                loserId: fixture.awayId
            }
        });
        
        return Observable.of(actions.saveResults(results));
    });