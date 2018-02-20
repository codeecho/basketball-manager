class StateSelector{
    
    getTeam(state, teamId){
        return state.teams.find(team => team.id === teamId);
    }
    
    getTeamPlayers(state, teamId){
        return state.players.filter(player => player.teamId === teamId);
    }
    
    getUserTeam(state){
        const teamId = state.gameState.teamId;
        return this.getTeam(state, teamId);
    }
    
    getCPUTeams(state){
        const teamId = state.gameState.teamId;
        return state.teams.filter(team => team.id !== teamId);
    }
    
    getUserPlayers(state){
        const teamId = state.gameState.teamId;
        return this.getTeamPlayers(state, teamId);
    }
    
    getPlayer(state, playerId){
        return state.players.find(player => player.id == playerId);
    }
 
}

const stateSelector = new StateSelector();

export default stateSelector;


// WEBPACK FOOTER //
// src/utils/stateSelector.js