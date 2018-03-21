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
        const {playerId, teamId} = action;
        return this.signPlayer(state, playerId, teamId);
    }
    
    extendContract(action, state){
        const {playerId, teamId} = action;
        return this.signPlayer(state, playerId, teamId);
    }
    
    releasePlayer(action, state){
        const {playerId, teamId} = action;
        
        const player = stateSelector.getPlayer(state, playerId);
        
        if(!teamId || teamId === state.gameState.teamId) toast.warning(`${player.name} has been released`);
        
        return chain(
            stateModifier.modifyPlayers(state, [playerId], player => {
                return {teamId: null};
            })
        )
        .then(state => this.teamStateModifier.modifyPayroll(state, [teamId || state.gameState.teamId]))
        .result;
    }
    
    signPlayer(state, playerId, teamId){
        const salaryCap = state.options.salaryCap;
        const team = teamId ? stateSelector.getTeam(state, teamId) : stateSelector.getUserTeam(state);
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

        const {requested, fromTeamId, toTeamId, offered} = trade;
        
        const toTeam = state.teams.find(team => team.id === toTeamId);
        
        const players = state.players.map(player => {
            if(requested.playerIds.includes(player.id)){
                if(fromTeamId === state.gameState.teamId) toast.success(`You signed ${player.name} from ${toTeam.name}`)
                return Object.assign({}, player, {teamId: fromTeamId});
            }else if(offered.playerIds.includes(player.id)){
                if(fromTeamId === state.gameState.teamId) toast.warning(`${player.name} signed for ${toTeam.name}`)               
                return Object.assign({}, player, {teamId: toTeamId});
            }else{
                return player;
            }
        });
        
        let tradedPicks = state.tradedPicks
            .filter(pick => !requested.picks.concat(offered.picks).find(x => x.year === pick.year && x.round === pick.round && x.teamId === pick.teamId))
            .concat(requested.picks.map(pick => {
                return {
                    year: pick.year,
                    round: pick.round,
                    teamId: pick.teamId,
                    ownerId: fromTeamId
                };
            }))
            .concat(offered.picks.map(pick => {
                return {
                    year: pick.year,
                    round: pick.round,
                    teamId: pick.teamId,
                    ownerId: toTeamId
                };
            }))            
        
        if(fromTeamId === state.gameState.teamId){
            window.location = `#/team/${fromTeamId}`;
        }
        
        return chain(Object.assign({}, state, {players, tradedPicks}))
            .then(state => this.teamStateModifier.modifyPayroll(state, [fromTeamId, toTeamId]))
            .result;
    }

}


// WEBPACK FOOTER //
// src/reducers/PlayerActionsReducer.js