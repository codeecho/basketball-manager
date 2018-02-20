class StateModifier{
    
    modifyGameState(state, updates){
        const gameState = Object.assign({}, state.gameState, updates);
        return Object.assign({}, state, {gameState});
    }
    
    modifyPlayers(state, ids, modifier){
        return Object.assign({}, state, { players: this.modifyArray(state.players, ids, modifier)});
    }
    
    modifyStandings(state, ids, modifier){
        return Object.assign({}, state, { standings: this.modifyArray(state.standings, ids, modifier)});
    }
    
    modifyTeams(state, ids, modifier){
        return Object.assign({}, state, { teams: this.modifyArray(state.teams, ids, modifier)});
    }
    
    modifyArray(array, ids, modifier){
        if(!modifier){
            modifier = ids;
            ids = undefined;
        }
        return array.map(item => {
            if(ids && !ids.includes(item.id)) return item;
            const changes = modifier(item) || {};
            return Object.assign({}, item, changes);
        });
    }
    
}

const stateModifier = new StateModifier();

export default stateModifier;


// WEBPACK FOOTER //
// src/reducers/modifiers/stateModifier.js