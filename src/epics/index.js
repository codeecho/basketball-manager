import { Observable } from 'rxjs';
import { combineEpics } from 'redux-observable';
import { advanceEpic } from './advanceEpic';
import { loadDemoDataEpic } from './loadDemoDataEpic';
import { hostOnlineGameEpic } from './hostOnlineGameEpic';
import { joinOnlineGameEpic } from './joinOnlineGameEpic';
import { playNextRoundEpic } from './playNextRoundEpic';
import { playerReadyEpic } from './playerReadyEpic';
import { clientAdvanceEpic } from './clientAdvanceEpic';

const debugEpic = (action$, store) =>
  action$
    .do(action => console.log('ACTION:', action))
    .switchMap(() => Observable.empty());

const rootEpic = combineEpics(
  debugEpic,
  advanceEpic,
  loadDemoDataEpic,
  hostOnlineGameEpic,
  joinOnlineGameEpic,
  playNextRoundEpic,
  playerReadyEpic,
  clientAdvanceEpic
);

export default rootEpic;
