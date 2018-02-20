import { Observable } from 'rxjs';
import * as actions from '../actions';
import Randomizer from '../utils/Randomizer';

const randomizer = new Randomizer();

export const hostOnlineGameEpic = (action$, store) =>
  action$
    .filter(action => action.type === actions.HOST_ONLINE_GAME)
    .debounceTime(0)
    .switchMap(() => {
        const state = store.getState();
        
        const gameId = state.gameState.id;
        
        return Observable.of(actions.joinOnlineGame(gameId));
    });


// WEBPACK FOOTER //
// src/epics/hostOnlineGameEpic.js