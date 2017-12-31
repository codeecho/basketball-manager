import { Observable } from 'rxjs';
import * as actions from '../actions';
import demoJson from '../data/demo.json';

export const loadDemoDataEpic = (action$) =>
  action$
    .filter(action => action.type === actions.LOAD_DEMO_DATA)
    .debounceTime(500)
    .switchMap(() => {
        const data = JSON.parse(demoJson);
        
        return Observable.of(actions.loadGameData(data));
    });