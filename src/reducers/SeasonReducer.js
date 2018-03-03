import stateSelector from '../utils/stateSelector';
import stateModifier from './modifiers/stateModifier';
import Randomizer from '../utils/Randomizer';
import DraftService from '../services/DraftService';
import PlayerService from '../services/PlayerService';
import TeamService from '../services/TeamService';
import TeamStateModifier from './modifiers/TeamStateModifier';
import {toast} from 'react-toastify';
import {chain} from '../utils/utils';
import ordinal from 'ordinal';
import { GAME_STATE_REGULAR_SEASON, GAME_STATE_PLAYOFFS, GAME_STATE_POST_SEASON, GAME_STATE_END_OF_SEASON, 
    GAME_STATE_CONTRACT_NEGOTIATIONS, GAME_STATE_FREE_AGENCY, GAME_STATE_DRAFT, FREE_AGENT_TEAM_ID,
    RETIRED_TEAM_ID, UNDRAFTED_TEAM_ID } from '../constants';

export default class SeasonReducer{
    
    constructor(){
        this.draftService = new DraftService();
        this.playerService = new PlayerService();
        this.teamService = new TeamService();
        this.teamStateModifier = new TeamStateModifier(this.teamService);
    }
    
    endRegularSeason(action, state){
        const stage = GAME_STATE_PLAYOFFS;        
        const standing = state.standings.find(standing => standing.teamId === state.gameState.teamId);
        const position = state.standings.indexOf(standing) + 1;
        if(position > 0){
            toast.info(`You finished ${ordinal(position)}`);
        }
        const gameState = Object.assign({}, state.gameState, {stage});
        return Object.assign({}, state, {gameState});
    }
    
    createNextPlayoffRound(action, state){
        const {isFirstRound} = action;
        
        const {numberOfPlayoffTeams} = state.options;
        
        let allTeamIds;
        
        if(isFirstRound){
            allTeamIds = state.standings.map(standing => standing.teamId)
        }else{
            const playoffRound = state.playoffs[state.playoffs.length - 1];
            allTeamIds = playoffRound.map(fixture => fixture.winnerId);
        }

        const seededTeamIds = state.standings.filter(standing => allTeamIds.includes(standing.teamId)).map(standing => standing.teamId);

        const teamIds = seededTeamIds.slice(0, numberOfPlayoffTeams);

        const topTeamIds = teamIds.slice(0, teamIds.length/2);
        
        const firstRound = topTeamIds.map((homeId, i) => {
            const awayId = teamIds[teamIds.length - i - 1];
            return {id: i, homeId, awayId, playoff:true};
        });
        
        const isFinal = firstRound.length === 1;
        
        const homeOrAway = state.options.playoffType === 'BBL' ? isFinal ? [false] : [false, true] : [false, false, true, true, false, false, true];
        
        const allRounds = homeOrAway.map(switchTeams => {
            return firstRound.map(fixture => {
                if(!switchTeams) return Object.assign({}, fixture);
                return {id: fixture.id, homeId: fixture.awayId, awayId: fixture.homeId, playoff:true};
            })
        })
        
        const playoffRound = firstRound.map(fixture => {
            return {id: fixture.id, homeId: fixture.homeId, awayId: fixture.awayId, played: 0, homeWins: 0, awayWins: 0, homeScore: 0, awayScore: 0};
        });
        
        const fixtures = state.fixtures.concat(allRounds);
        
        const playoffs = state.playoffs.concat([playoffRound]);
        
        firstRound.forEach(fixture => {
            if([fixture.homeId, fixture.awayId].includes(state.gameState.teamId)){
                const opponentId = [fixture.homeId, fixture.awayId].find(teamId => teamId !== state.gameState.teamId);
                const opponent = state.teams.find(team => team.id === opponentId);
                const round = isFirstRound ? 'first round' : isFinal ? 'final' : 'next round'; 
                toast.info(`You will play ${opponent.name} in the ${round} of the playoffs`);
            }
        })
        
        return Object.assign({}, state, {fixtures, playoffs});
    }
    
    endPlayoffs(action, state){
        const stage = GAME_STATE_POST_SEASON;
        
        const playoffRound = state.playoffs[state.playoffs.length - 1];

        const winner = state.teams.find(team => team.id === playoffRound[0].winnerId);
        toast.info(`${winner.name} are champions`);
        
        const gameState = Object.assign({}, state.gameState, {stage});
        return Object.assign({}, state, {gameState});
    }
    
    handleExpiringContracts(action, state){
        const {seed} = action;
        
        const randomizer = new Randomizer(seed);
        
        const userTeamId = state.gameState.teamId;
        
        const team = state.teams.find(team => team.id === userTeamId);
        
        // Handle retirements
        const players = state.players.map(player => {
            if(player.age < 32) return player;
            
            const retirementPossibility = Math.pow(player.age - 32, 2)/100;
            const isRetiring = randomizer.getRandomBoolean(retirementPossibility);
            
            if(!isRetiring) return player;
            
            if(player.teamId === userTeamId) toast.warning(`${player.name} has retired`);
            
            return Object.assign({}, player, {teamId: RETIRED_TEAM_ID});
        })
        
        const playersWithExpiringContracts = state.players.filter(player => player.teamId === userTeamId && player.contractExpiry === state.gameState.year);
        
        playersWithExpiringContracts.forEach(player => toast.info(`${player.name}'s contract is expiring`));
        
        const stage = GAME_STATE_CONTRACT_NEGOTIATIONS;
        const gameState = Object.assign({}, state.gameState, {stage});
        return Object.assign({}, state, {gameState, players});
    }
    
    applyTraining(action, state){
        const {seed} = action;
        const randomizer = new Randomizer(seed);
        return stateModifier.modifyPlayers(state, player => {
            if(player.teamId === UNDRAFTED_TEAM_ID) return;
            if(player.teamId === FREE_AGENT_TEAM_ID) return;
            const originalAbility = player.ability;
            const realDelta = this.playerService.calculateTrainingAdjustment(player);
            const realAbility = player.realAbility + realDelta;
            const ability = Math.floor(realAbility);
            const delta = ability - originalAbility;
            const attrDeltas = getAttributeDeltas(randomizer, delta);
            const scoring = player.scoring + attrDeltas[0];
            const defense = player.defense + attrDeltas[1];
            const rebounding = player.rebounding + attrDeltas[2];
            const passing = player.passing + attrDeltas[3];            
            const expectedSalary = this.playerService.calculateExpectedSalary(Object.assign({}, player, {delta, ability, realAbility, scoring, defense, rebounding, passing}));
            return { delta, ability, realAbility, expectedSalary, scoring, defense, rebounding, passing };
        });
    }
    
    doDraft(action, state){
        const {seed} = action;
        
        const randomizer = new Randomizer(seed);
        const draftService = new DraftService(randomizer);
        
        const {draftType} = state.options;

        if(draftType === 'BBL'){
            const draft = draftService.createDraftClass(state.gameState.year+1, state.nextPlayerId, state.teams.length*2);
            draft.forEach(player => player.teamId = FREE_AGENT_TEAM_ID);
            const nextPlayerId = state.nextPlayerId + draft.length;
            const players = state.players.concat(draft);
            const stage = GAME_STATE_FREE_AGENCY;
            const gameState = Object.assign({}, state.gameState, {stage});
            const newState = Object.assign({}, state, {gameState, nextPlayerId, players});
            return this.handleExpiringContracts(action, newState);
        }
        
        const {year, teamId} = state.gameState;
        let draft = state.players.filter(player => player.draftYear === year);
        draft.sort((a, b) => b.potential - a.potential);
        let players = state.players.concat();
        const standings = state.standings.concat();
        standings.sort((a, b) => a.won - b.won);
        standings.forEach((standing, i) => {
            const player = draft[i];
            player.teamId = standing.teamId;
            player.contractExpiry = year+3;
            if(player.teamId === teamId) toast.info(`You drafted ${player.name} in the 1st round of the draft`);
        });
        draft = draft.slice(standings.length);
        standings.forEach((standing, i) => {
            const player = draft[i];
            player.teamId = standing.teamId;
            player.contractExpiry = year+3;
            if(player.teamId === teamId) toast.info(`You drafted ${player.name} in the 2nd round of the draft`);
        });
        draft = draftService.createDraftClass(state.gameState.year+1, state.nextPlayerId, state.teams.length*2);
        const nextPlayerId = state.nextPlayerId + draft.length;
        players = players.concat(draft);
        const stage = GAME_STATE_DRAFT;
        const gameState = Object.assign({}, state.gameState, {stage});
        
        return chain(Object.assign({}, state, {gameState, players, nextPlayerId}))
            .then(state => this.teamStateModifier.modifyPayroll(state))
            .result;
    }
    
    createFreeAgents(action, state){
        const {seed} = action;
        
        const randomizer = new Randomizer(seed);
        
        const year = state.gameState.year;
        const teamId = state.gameState.teamId;
        const salaryCap = state.options.salaryCap;
        
        const players = state.players.concat();
        
        state.teams.forEach(team => {
            const isUserTeam = team.id == teamId;
            
            const isOtherUserTeam = state.onlineGame.users.find(user => user.teamId === team.id);
            
            const teamPlayers = players.filter(player => player.teamId === team.id);
            
            const playersWithExpiringContracts = teamPlayers.filter(player => player.contractExpiry === year);
            
            if(isUserTeam){
                playersWithExpiringContracts.forEach(player => {                
                    toast.info(`${player.name} is now a free agent`);
                    player.teamId = FREE_AGENT_TEAM_ID;
                });
                return;
            }
            
            if(isOtherUserTeam){
                playersWithExpiringContracts.forEach(player => {                
                    player.teamId = FREE_AGENT_TEAM_ID;
                });
                return;
            }
        
            const lineup = this.teamService.getLineup(teamPlayers);
        
            playersWithExpiringContracts.sort((a, b) => b.ability - a.ability);
            const playersWithoutExpiringContracts = teamPlayers.filter(player => player.contractExpiry !== year);
            
            const nextYearPayroll = playersWithoutExpiringContracts.reduce((total, player) => total + player.salary, 0);
            
            let capSpace = salaryCap - nextYearPayroll;
            
            playersWithExpiringContracts.forEach(player => {
                
                const {expectedSalary} = player;
                
                const resignPossibility = lineup.starters.includes(player) ? 0.8 : lineup.secondUnit.includes(player) ? 0.6 : 0
                
                const shouldResign = expectedSalary < capSpace && randomizer.getRandomBoolean(resignPossibility);
                
                if(shouldResign){
                    player.contractExpiry = year + 3;
                    player.salary = expectedSalary;
                    capSpace = capSpace - expectedSalary;
                }else{
                    player.teamId = FREE_AGENT_TEAM_ID;
                }
                
            });
        });
        
        const stage = GAME_STATE_FREE_AGENCY;
        const gameState = Object.assign({}, state.gameState, {stage});
        
        return chain(Object.assign({}, state, {gameState, players}))
            .then(state => this.teamStateModifier.modifyPayroll(state))
            .result;
    }
    
    aiSignFreeAgents(action, state){
        const stage = GAME_STATE_END_OF_SEASON;
        
        const userTeamId = state.gameState.teamId;
        const players = state.players.concat();
        const teams = state.teams.concat();
        const year = state.gameState.year;
        const salaryCap = state.options.salaryCap;
        
        let rostersFull = false;
        
        while(!rostersFull){
            
            rostersFull = true;
            
            teams.forEach(team => {
                if(team.id === userTeamId) return;
                
                if(state.onlineGame.users.find(user => user.teamId === team.id)) return;
                
                if(players.filter(player => player.teamId === team.id).length >= 17) return;
                
                const payroll = team.payroll;
                let availableSalary = salaryCap - payroll;
                if(availableSalary < 0) availableSalary = 1;
                
                const freeAgents = players.filter(player => player.teamId === FREE_AGENT_TEAM_ID && player.expectedSalary <= availableSalary);
                
                freeAgents.sort((a,b) => b.ability - a.ability);
                
                if(freeAgents.length > 0){
                    const freeAgent = freeAgents[0];
                    freeAgent.teamId = team.id;
                    freeAgent.contractExpiry = year + 3;
                    freeAgent.salary = freeAgent.expectedSalary;
                    team.payroll = payroll + freeAgent.salary;
                    rostersFull = false;
                }
            });
        
        }

        
        const gameState = Object.assign({}, state.gameState, {stage});
        
        return Object.assign({}, state, {gameState, players, teams});
    }
    
    endSeason(action, state){
        const round = 0;
        const stage = GAME_STATE_REGULAR_SEASON;
        const year = state.gameState.year + 1;
        
        const gameState = Object.assign({}, state.gameState, { round, stage, year});
        
        const fixtures = state.fixtures.filter(round => !round[0].playoff).map(round => {
            return round.map(fixture => Object.assign({}, fixture, {winnerId: undefined, loserId: undefined, homeScore: undefined, awayScore: undefined, homePlayerRatings: [], awayPlayerRatings: []}));
        });
        
        state = stateModifier.modifyGameState(state, { round, stage, year });
        state = stateModifier.modifyStandings(state, () => ({played: 0, won: 0, lost: 0}));
        state = stateModifier.modifyPlayers(state, player => ({ age: year - player.dob -1 }));
        return Object.assign({}, state, {fixtures, playerRatings: [], playoffs: []});
    }
    
}

function getAttributeDeltas(randomizer, delta){
    if(delta <= 0) return [delta, delta, delta, delta];
    const total = delta * 4;
    const deltas = [];
    const lowerBand = Math.max(delta-3, 0);
    const upperBand = delta+3;
    let allocated = 0;
    for(let i=0; i< 3; i++){
        let n = randomizer.getRandomInteger(lowerBand, upperBand);
        n = Math.min(n, total-allocated);
        allocated += n;
        deltas.push(n);
    }
    deltas.push(total-allocated);
    return deltas;
}


// WEBPACK FOOTER //
// src/reducers/SeasonReducer.js