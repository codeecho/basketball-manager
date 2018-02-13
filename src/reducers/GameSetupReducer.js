import stateModifier from './modifiers/stateModifier';
import stateSelector from '../utils/stateSelector';

import Randomizer from '../utils/Randomizer';
import DraftService from '../services/DraftService';
import PlayerService from '../services/PlayerService';
import TeamService from '../services/TeamService';
import TeamStateModifier from './modifiers/TeamStateModifier';

import {chain} from '../utils/utils';

export default class GameSetupReducer{
    
    constructor(){
    }
    
    loadGameData(action, state){
        const {data} = action;
        
        const year = data.options.startYear;
        
        const seed = data.seed;
        const randomizer = new Randomizer(seed);
        const draftService = new DraftService(randomizer);
        const playerService = new PlayerService();    
        const teamService = new TeamService();
        const teamStateModifier = new TeamStateModifier(teamService);
        
        const draft = draftService.createDraftClass(year, data.nextPlayerId, data.teams.length*2);
        const nextPlayerId = data.nextPlayerId + draft.length;
        
        const players = data.players.concat(draft);
        
        let newState = Object.assign({}, state, data, { players, nextPlayerId });
    
        newState.gameState.year = year;
        
        return chain(stateModifier.modifyPlayers(newState, player => {
            const age = year - player.dob - 1;
            const delta = 0;
            const realAbility = player.ability;
            const expectedSalary = playerService.calculateExpectedSalary(Object.assign({}, player, {age, delta, realAbility}));
            const salary = player.salary || expectedSalary;
            return { age, delta, realAbility, expectedSalary, salary };
        }))
        .then(state => teamStateModifier.modifyPayroll(state))
        .result;
    }
    
    setTeam(action, state){
        const {teamId, username} = action;
        const gameState = Object.assign({}, state.gameState, { teamId });
        const randomizer = new Randomizer();
        const userId = randomizer.getRandomString(10);
        const user = Object.assign({}, state.user, {id: userId, name: username})
        return Object.assign({}, state, { gameState, user });
    }
    
}