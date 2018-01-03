import { Observable } from 'rxjs';
import * as actions from '../actions';
import data from '../data/demo.json';

export const loadDemoDataEpic = (action$) =>
  action$
    .filter(action => action.type === actions.LOAD_DEMO_DATA)
    .debounceTime(0)
    .switchMap(() => {
        return Observable.of(actions.loadGameData(data));
    });