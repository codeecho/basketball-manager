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
    RETIRED_TEAM_ID, UNDRAFTED_TEAM_ID, STRATEGY_TITLE_CONTENDERS, STRATEGY_PLAYOFF_CONTENDERS, STRATEGY_REBUILDING,
    STRATEGY_TITLE_HOPEFULS, STRATEGY_PLAYOFF_HOPEFULS, STRATEGY_TANKING} from '../constants';

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
        const champions = state.champions.concat({year: state.gameState.year, teamId: winner.id});
        
        const gameState = Object.assign({}, state.gameState, {stage});
        return Object.assign({}, state, {gameState, champions});
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
            const updatedPlayer = this.playerService.applyTraining(player);
            const expectedSalary = this.playerService.calculateExpectedSalary(updatedPlayer);
            return Object.assign({}, updatedPlayer, {expectedSalary});
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
            const tradedPick = state.tradedPicks.find(pick => pick.year === year && pick.round === 1 && pick.teamId === standing.teamId);
            player.teamId = tradedPick ? tradedPick.ownerId : standing.teamId;
            player.contractExpiry = year+3;
            if(player.teamId === teamId) toast.info(`You drafted ${player.name} with the ${ordinal(i+1)} pick in the 1st round of the draft`);
        });
        
        draft = draft.slice(standings.length);
        
        standings.forEach((standing, i) => {
            const player = draft[i];
            const tradedPick = state.tradedPicks.find(pick => pick.year === year && pick.round === 2 && pick.teamId === standing.teamId);
            player.teamId = tradedPick ? tradedPick.ownerId : standing.teamId;
            player.contractExpiry = year+3;
            if(player.teamId === teamId) toast.info(`You drafted ${player.name} with the ${ordinal(i+1)} pick in the 2nd round of the draft`);
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
            const isUserTeam = team.id === teamId;
            
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
                
                const resignPossibility = lineup.starters.includes(player) ? 0.8 : lineup.secondUnit.includes(player) ? 0.6 : 0;
                
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
        
        const teams = state.teams.map(team => {
            const players = state.players.filter(player => player.teamId === team.id);
            const rating = this.teamService.getSquadRating(players);
            return Object.assign({}, team, {rating});
        });
        
        teams.sort((a,b) => b.rating - a.rating);
        
        teams.forEach((team, i) => {
            team.ranking = i+1;
            const n = Math.max(teams.length / 6, 1);
            if(i < n){
                team.strategy = STRATEGY_TITLE_CONTENDERS;
            }else if(i < 2*n){
                team.strategy = STRATEGY_TITLE_HOPEFULS;                
            }else if(i < 3*n){
                team.strategy = STRATEGY_PLAYOFF_CONTENDERS;                
            }else if(i < 4*n){
                team.strategy = STRATEGY_PLAYOFF_HOPEFULS;                
            }else if(i < 5*n){
                team.strategy = STRATEGY_REBUILDING;                
            }else{
                team.strategy = STRATEGY_TANKING;                
            }
        });
        
        state = stateModifier.modifyGameState(state, { round, stage, year });
        state = stateModifier.modifyStandings(state, () => ({played: 0, won: 0, lost: 0}));
        state = stateModifier.modifyPlayers(state, player => ({ age: year - player.dob -1 }));
        return Object.assign({}, state, {teams, fixtures, playerRatings: [], playoffs: []});
    }
    
}