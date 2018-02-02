import stateModifier from './modifiers/stateModifier';
import stateSelector from '../utils/stateSelector';
import {toast} from 'react-toastify';

export default class PlayerActionsReducer{
    
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
        
        return Object.assign(
            {},
            state,
            stateModifier.modifyPlayer(state, playerId, player => {
                return {teamId: null};
            })
        );
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
        
        return Object.assign(
            {}, 
            state, 
            stateModifier.modifyPlayer(state, playerId, player => {
                return {teamId: team.id, contractExpiry: year+3, salary: player.expectedSalary};
            })
        );        
    }
    
    setTradeProposal(action, state){
        const {proposal} = action;
        window.location = '#/trade';
        return Object.assign(
            {}, 
            state, 
            stateModifier.modifyGameState(state, {tradeProposal: proposal})
        );
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
        return Object.assign({}, state, {players});
    }
    
}