import stateModifier from './modifiers/stateModifier';
import stateSelector from '../utils/stateSelector';
import {toast} from 'react-toastify';
import {chain} from '../utils/utils';
import TeamService from '../services/TeamService';
import TeamStateModifier from './modifiers/TeamStateModifier';

export default class PlayerActionsReducer{
    
    constructor(){
        this.teamService = new TeamService();
        this.teamStateModifier = new TeamStateModifier(this.teamService);
    }
    
    signFreeAgent(action, state){
        const {playerId} = action;
        return this.signPlayer(state, playerId);
    }
    
    extendContract(action, state){
        const {playerId} = action;
        return this.signPlayer(state, playerId);
    }
    
    releasePlayer(action, state){
        const {playerId} = action;
        
        const player = stateSelector.getPlayer(state, playerId);
        
        toast.warning(`${player.name} has been released`);
        
        return stateModifier.modifyPlayers(state, [playerId], player => {
            return {teamId: null};
        });
    }
    
    signPlayer(state, playerId){
        const salaryCap = state.options.salaryCap;
        const team = stateSelector.getUserTeam(state);
        const player = stateSelector.getPlayer(state, playerId);
        
        let newPayroll = team.payroll + player.expectedSalary;
        
        if(player.teamId === team.id) newPayroll -= player.salary;
        
        if(newPayroll > salaryCap && player.expectedSalary > 1){
            toast.warning('Not enough salary cap space');
            return state;
        }
        
        const year = state.gameState.year;
        
        return chain(
            stateModifier.modifyPlayers(state, [playerId], player => {
                return {teamId: team.id, contractExpiry: year+3, salary: player.expectedSalary};
            })
        )
        .then(state => this.teamStateModifier.modifyPayroll(state, [team.id]))
        .result;
    }
    
    setTradeProposal(action, state){
        const {proposal} = action;
        window.location = '#/trade';
        return stateModifier.modifyGameState(state, {tradeProposal: proposal});
    }
    
    completeTrade(action, state){
        const {trade} = action;
        const {requested, team: cpuTeamId, offered} = trade;
        const userTeamId = state.gameState.teamId;
        
        const players = state.players.map(player => {
            if(requested.players.includes(player)){
                return Object.assign({}, player, {teamId: userTeamId});
            }else if(offered.players.includes(player)){
                return Object.assign({}, player, {teamId: cpuTeamId});
            }else{
                return player;
            }
        });
        
        const cpuTeam = stateSelector.getTeam(state, cpuTeamId);
        
        requested.players.forEach(player => toast.success(`You signed ${player.name} from ${cpuTeam.name}`));
        offered.players.forEach(player => toast.warning(`${player.name} signed for ${cpuTeam.name}`));
        
        window.location = `#/team/${userTeamId}`;
        
        return chain(Object.assign({}, state, {players}))
            .then(state => this.teamStateModifier.modifyPayroll(state, [userTeamId, cpuTeamId]))
            .result;
    }

}