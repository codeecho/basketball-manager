const CURRENT_GAME_ID = 'currentGameId';
const GAMES_LIST = 'gamesList';

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
        localStorage.setItem(CURRENT_GAME_ID, gameId);
        return savedGameState;
    }
    
    saveGame(state){
        const gameId = state.gameState.id;
        const stage = state.gameState.stage;
        const year = state.gameState.year;
        const teamId = state.gameState.teamId;  
        const team = teamId > 0 ? state.teams.find(team => team.id === teamId) : {name: 'No Team'};
        localStorage.setItem(CURRENT_GAME_ID, gameId);
        localStorage.setItem(gameId, btoa(JSON.stringify(state)));
        const gamesList = this.getSavedGames().filter(game => gameId !== game.id);
        gamesList.push({id: gameId, label: `${team.name} ${stage} ${year}`});
        localStorage.setItem(GAMES_LIST, btoa(JSON.stringify(gamesList)));
    }
    
    newGame(){
        localStorage.removeItem(CURRENT_GAME_ID);        
    }
    
    getSavedGames(){
        const gamesListEncoded = localStorage.getItem(GAMES_LIST);
        const gamesList = gamesListEncoded ? JSON.parse(atob(gamesListEncoded)) : [];
        return gamesList;
    }
    
    deleteGame(gameId){
        localStorage.removeItem(gameId);  
        const gamesList = this.getSavedGames().filter(game => gameId !== game.id);
        localStorage.setItem(GAMES_LIST, btoa(JSON.stringify(gamesList)));
    }
    
}


// WEBPACK FOOTER //
// src/services/PersistenceService.js