import { Observable } from 'rxjs';
import { combineEpics } from 'redux-observable';
import { advanceEpic } from './advanceEpic';
import { loadDemoDataEpic } from './loadDemoDataEpic';

const debugEpic = (action$, store) =>
  action$
    .do(action => console.log('ACTION:', action))
    .switchMap(() => Observable.empty());

const rootEpic = combineEpics(
  debugEpic,
  advanceEpic,
  loadDemoDataEpic
);

export default rootEpic;
