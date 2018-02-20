import { Observable } from 'rxjs';
import * as actions from '../actions';

export const serverEventEpic = (action$, store) =>
  action$
    .filter(action => action.type === actions.SERVER_EVENT)
    .debounceTime(0)
    .switchMap(({action}) => {
        const state = store.getState();
        
        if(!state.onlineGame.id){
            return Observable.of(action);
        }else{
            action.type = 'server/' + action.type;
            action.teamId = state.gameState.teamId;
            return Observable.of(action);
        }
        
        return Observable.of(actions.serverGameState(users));
    });


// WEBPACK FOOTER //
// src/epics/serverEventEpic.js