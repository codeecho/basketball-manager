import { Observable } from 'rxjs';
import * as actions from '../actions';
import data from '../data/test.json';

import { toast } from 'react-toastify';

export const loadTestDataEpic = (action$) =>
  action$
    .filter(action => action.type === actions.LOAD_TEST_DATA)
    .debounceTime(0)
    .switchMap(() => {
        return Observable.of(actions.loadGameData(data));
    });


// WEBPACK FOOTER //
// src/epics/loadTestDataEpic.js