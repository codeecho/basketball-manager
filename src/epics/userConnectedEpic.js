import { Observable } from 'rxjs';
import * as actions from '../actions';

export const userConnectedEpic = (action$, store) =>
  action$
    .filter(action => action.type === actions.CLIENT_USER_CONNECTED)
    .debounceTime(0)
    .switchMap(({user, metadata}) => {
        const state = store.getState();
        
        if(!state.onlineGame.isHost) return Observable.of(actions.noop());
        
        const users = state.onlineGame.users.concat({id: user.id, name: user.name, teamId: metadata.teamId});
        
        return Observable.of(actions.serverGameState(users));
    });


// WEBPACK FOOTER //
// src/epics/userConnectedEpic.js