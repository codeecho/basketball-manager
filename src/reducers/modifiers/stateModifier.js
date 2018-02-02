class StateModifier{
    
    modifyGameState(state, updates){
        const gameState = Object.assign({}, state.gameState, updates);
        return {gameState};
    }
    
    modifyPlayers(state, modifier){
        return { players: this.modifyArray(state.players, modifier)};
    }
    
    modifyStandings(state, modifier){
        return { standings: this.modifyArray(state.standings, modifier)};
    }
    
    modifyTeams(state, modifier){
        return { teams: this.modifyArray(state.teams, modifier)};
    }
    
    modifyPlayer(state, playerId, modifier){
        const players = state.players.map(player => {
            if(player.id !== playerId) return player;
            return Object.assign({}, player, modifier);
        });
        return { players };
    }
    
    modifyArray(array, modifier){
        return array.map(item => {
            return Object.assign({}, item, modifier(item));
        });
    }
    
}

const stateModifier = new StateModifier();

export default stateModifier;