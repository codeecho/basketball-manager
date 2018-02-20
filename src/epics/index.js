import { Observable } from 'rxjs';
import { combineEpics } from 'redux-observable';
import { advanceEpic } from './advanceEpic';
import { loadDemoDataEpic } from './loadDemoDataEpic';
import { loadTestDataEpic } from './loadTestDataEpic';
import { loadBBLDataEpic } from './loadBBLDataEpic';
import { hostOnlineGameEpic } from './hostOnlineGameEpic';
import { joinOnlineGameEpic } from './joinOnlineGameEpic';
import { playNextRoundEpic } from './playNextRoundEpic';
import { playerReadyEpic } from './playerReadyEpic';
import { clientAdvanceEpic } from './clientAdvanceEpic';
import { userConnectedEpic } from './userConnectedEpic';
import { serverEventEpic } from './serverEventEpic';

const debugEpic = (action$, store) =>
  action$
    .do(action => console.log('ACTION:', action))
    .switchMap(() => Observable.empty());

const rootEpic = combineEpics(
  debugEpic,
  advanceEpic,
  loadDemoDataEpic,
  loadTestDataEpic,
  loadBBLDataEpic,
  hostOnlineGameEpic,
  joinOnlineGameEpic,
  playNextRoundEpic,
  playerReadyEpic,
  clientAdvanceEpic,
  userConnectedEpic,
  serverEventEpic
);

export default rootEpic;



// WEBPACK FOOTER //
// src/epics/index.js