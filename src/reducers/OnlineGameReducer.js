export default class OnlineGameReducer{
    
    hostOnlineGame(action, state){
        const onlineGame = Object.assign({}, state.onlineGame, {isHost: true});
        return Object.assign({}, state, {onlineGame});
    }
    
    joinOnlineGame(action, state){
        const {gameId} = action;
        const onlineGame = Object.assign({}, state.onlineGame, {id: gameId});
        return Object.assign({}, state, {onlineGame});
    }
    
    clientPlayerReady(action, state){
        const {user} = action;
        if(state.onlineGame.playersReady.indexOf(user.id) > -1) return state;
        const playersReady = state.onlineGame.playersReady.concat(user.id);
        const onlineGame = Object.assign({}, state.onlineGame, {playersReady});
        return Object.assign({}, state, {onlineGame});
    }
    
    clientAdvance(action, state){
        const playersReady = [];
        const onlineGame = Object.assign({}, state.onlineGame, {playersReady});
        return Object.assign({}, state, {onlineGame});
    }
    
    clientGameState(action, state){
        const {users} = action;
        const onlineGame = Object.assign({}, state.onlineGame, {users});
        return Object.assign({}, state, {onlineGame});
    }
    
}


// WEBPACK FOOTER //
// src/reducers/OnlineGameReducer.js