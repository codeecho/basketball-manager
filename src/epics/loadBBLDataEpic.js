import { Observable } from 'rxjs';
import * as actions from '../actions';
import data from '../data/bbl.json';

import { toast } from 'react-toastify';

export const loadBBLDataEpic = (action$) =>
  action$
    .filter(action => action.type === actions.LOAD_BBL_DATA)
    .debounceTime(0)
    .switchMap(() => {
        return Observable.of(actions.loadGameData(data));
    });