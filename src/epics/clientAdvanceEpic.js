import { Observable } from 'rxjs';
import * as actions from '../actions';

export const clientAdvanceEpic = (action$) =>
  action$
    .filter(action => action.type === actions.CLIENT_ADVANCE)
    .debounceTime(0)
    .switchMap(({seed}) => {
        return Observable.of(actions.advance(seed));
    });