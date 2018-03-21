import { Observable } from 'rxjs';
import * as actions from '../actions';

export const clientAdvanceEpic = (action$) =>
  action$
    .filter(action => action.type === actions.CLIENT_ADVANCE)
    .debounceTime(0)
    .switchMap(({numberOfRounds, playThroughPlayoffs, seed}) => {
        return Observable.of(actions.advance(numberOfRounds, playThroughPlayoffs, seed));
    });


// WEBPACK FOOTER //
// src/epics/clientAdvanceEpic.js