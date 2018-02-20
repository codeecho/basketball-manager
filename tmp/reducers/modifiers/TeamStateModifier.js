import stateModifier from './stateModifier';
import stateSelector from '../../utils/stateSelector';

export default class TeamStateModifier{
    
    constructor(teamService){
        this.teamService = teamService;
    }
    
    modifyPayroll(state, teamIds){
        return stateModifier.modifyTeams(state, teamIds, team => {
            const players = stateSelector.getTeamPlayers(state, team.id);
            const payroll = this.teamService.calculatePayroll(players);
            return { payroll };
        });
    }
    
}


// WEBPACK FOOTER //
// src/reducers/modifiers/TeamStateModifier.js