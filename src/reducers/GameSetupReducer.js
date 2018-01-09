import stateModifier from './modifiers/stateModifier';

import Randomizer from '../utils/Randomizer';
import DraftService from '../services/DraftService';

export default class GameSetupReducer{
    
    constructor(){
        this.randomizer = new Randomizer();
        this.draftService = new DraftService();
    }
    
    loadGameData(action, state){
        const {data} = action;
        
        const year = data.options.startYear;
        
        const draft = this.draftService.createDraftClass(year, data.nextPlayerId, data.teams.length*2);
        const nextPlayerId = data.nextPlayerId + draft.length;
        
        const newState = Object.assign({}, state, data, { draft, nextPlayerId });
    
        newState.gameState.year = year;
        
        return Object.assign(
            newState, 
            stateModifier.modifyPlayers(newState, player => ({ age: year - player.dob, delta: 0, realAbility: player.ability }))
        );
    }
    
    setTeam(action, state){
        const {teamId, username} = action;
        const gameState = Object.assign({}, state.gameState, { teamId });
        const userId = this.randomizer.getRandomString(10);
        const user = Object.assign({}, state.user, {id: userId, name: username})
        return Object.assign({}, state, { gameState, user });
    }
    
}