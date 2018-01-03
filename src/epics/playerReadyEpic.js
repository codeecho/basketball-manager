import { Observable } from 'rxjs';
import * as actions from '../actions';

export const playerReadyEpic = (action$, store) =>
  action$
    .filter(action => action.type === actions.CLIENT_PLAYER_READY)
    .debounceTime(0)
    .switchMap(() => {
        const state = store.getState();
        
        const {isHost, numberOfPlayers, playersReady} = state.onlineGame;
        
        if(isHost && playersReady.length === numberOfPlayers){
            const seed = Math.random();
            return Observable.of(actions.serverAdvance(seed));            
        }
        
        return Observable.of(actions.noop());
    });