import { Observable } from 'rxjs';
import * as actions from '../actions';

export const playerReadyEpic = (action$, store) =>
  action$
    .filter(action => action.type === actions.CLIENT_PLAYER_READY)
    .debounceTime(0)
    .switchMap(({numberOfRounds}) => {
        const state = store.getState();
        
        const {isHost, users, playersReady} = state.onlineGame;
        
        if(isHost && playersReady.length === users.length){
            const seed = Math.random();
            return Observable.of(actions.serverAdvance(numberOfRounds, seed));            
        }
        
        return Observable.of(actions.noop());
    });


// WEBPACK FOOTER //
// src/epics/playerReadyEpic.js