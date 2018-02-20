import { Observable } from 'rxjs';
import * as actions from '../actions';
import Randomizer from '../utils/Randomizer';

const randomizer = new Randomizer();

export const joinOnlineGameEpic = (action$, store) =>
  action$
    .filter(action => action.type === actions.JOIN_ONLINE_GAME)
    .debounceTime(0)
    .switchMap(({gameId}) => {
        const state = store.getState();
        
        const {user} = state;
        
        const teamId = state.gameState.teamId;
        
        return Observable.of(actions.serverJoinRoom(gameId, user, teamId));
    });


// WEBPACK FOOTER //
// src/epics/joinOnlineGameEpic.js