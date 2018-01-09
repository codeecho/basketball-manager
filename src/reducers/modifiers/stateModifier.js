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
    
    modifyArray(array, modifier){
        return array.map(item => {
            return Object.assign({}, item, modifier(item));
        });
    }
    
}

const stateModifier = new StateModifier();

export default stateModifier;