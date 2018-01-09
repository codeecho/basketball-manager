export default class PlayerActionsReducer{
    
    signFreeAgent(action, state){
        const {playerId} = action;
        const year = state.gameState.year;
        const teamId = state.gameState.teamId;
        const players = state.players.map(player => {
            if(player.id !== playerId) return player;
            return Object.assign({}, player, {teamId, contractExpiry: year+3});
        });
        return Object.assign({}, state, {players});
    }
    
    extendContract(action, state){
        const {playerId} = action;
        const year = state.gameState.year;
        const players = state.players.map(player => {
            if(player.id !== playerId) return player;
            return Object.assign({}, player, {contractExpiry: year+3});
        });
        return Object.assign({}, state, {players});
    }
    
}