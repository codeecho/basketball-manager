import stateModifier from './modifiers/stateModifier';
import stateSelector from '../utils/stateSelector';

import Randomizer from '../utils/Randomizer';
import DraftService from '../services/DraftService';
import PlayerService from '../services/PlayerService';
import TeamService from '../services/TeamService';

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
        
        const draft = draftService.createDraftClass(year, data.nextPlayerId, data.teams.length*2);
        const nextPlayerId = data.nextPlayerId + draft.length;
        
        let newState = Object.assign({}, state, data, { draft, nextPlayerId });
    
        newState.gameState.year = year;
        
        newState = Object.assign(
            newState, 
            stateModifier.modifyPlayers(newState, player => {
                const age = year - player.dob - 1;
                const delta = 0;
                const realAbility = player.ability;
                const expectedSalary = playerService.calculateExpectedSalary(Object.assign({}, player, {age, delta, realAbility}));
                const salary = player.salary || expectedSalary;
                return { age, delta, realAbility, expectedSalary, salary };
            }),
        );

        return Object.assign(
            newState,
            stateModifier.modifyTeams(newState, team => {
                const players = stateSelector.getTeamPlayers(newState, team.id);
                const payroll = teamService.calculatePayroll(players);
                return { payroll };
            })
        );
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