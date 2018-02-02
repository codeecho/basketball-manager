const CURRENT_GAME_ID = 'currentGameId';

export default class PersistenceService{
    
    loadCurrentGame(){
        const gameId = localStorage.getItem(CURRENT_GAME_ID);
        if(!gameId) return null;
        return this.loadGame(gameId);
    }
    
    loadGame(gameId){
        let savedGameState = localStorage.getItem(gameId);
        if(!savedGameState) return null
        savedGameState = JSON.parse(atob(savedGameState));
        savedGameState.onlineGame.id = undefined;
        return savedGameState;
    }
    
    saveGame(state){
        localStorage.setItem(CURRENT_GAME_ID, state.gameState.id);
        localStorage.setItem(state.gameState.id, btoa(JSON.stringify(state)));
    }
    
    newGame(){
        localStorage.removeItem(CURRENT_GAME_ID);        
    }
    
}