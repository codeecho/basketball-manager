import stateModifier from './modifiers/stateModifier';
import stateSelector from '../utils/stateSelector';

import Randomizer from '../utils/Randomizer';
import DraftService from '../services/DraftService';
import PlayerService from '../services/PlayerService';
import TeamService from '../services/TeamService';
import TeamStateModifier from './modifiers/TeamStateModifier';
import FixtureListGenerator from '../services/FixtureListGenerator';

import {chain} from '../utils/utils';

import {STRATEGY_TITLE_CONTENDERS, STRATEGY_TITLE_HOPEFULS, STRATEGY_PLAYOFF_CONTENDERS, STRATEGY_PLAYOFF_HOPEFULS, STRATEGY_REBUILDING, STRATEGY_TANKING} from '../constants';

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
        const fixtureListGenerator = new FixtureListGenerator();
        
        let players = data.players;
        let nextPlayerId = data.nextPlayerId;
        
        const hasDraft = data.players.filter(player => player.teamId === -2 && player.draftYear === year).length > 0
        
        if(!hasDraft){
            const draft = draftService.createDraftClass(year, data.nextPlayerId, data.teams.length*2);
            nextPlayerId = nextPlayerId + draft.length;
            players = players.concat(draft);
        }
        
        let fixtures = fixtureListGenerator.generate(data.teams);
        if(data.options.fixturesType === 'BBL'){
            fixtures = fixtures.concat(fixtureListGenerator.generate(data.teams, false));
        }
        
        fixtures = fixtures.map(round => {
            return round.map((fixture, i) => {
                return {
                    id: i,
                    homeId: fixture.home.id,
                    awayId: fixture.away.id
                };
            });
        });
        
        const teams = data.teams.map(team => {
           const players = data.players.filter(player => player.teamId === team.id);
           const rating = teamService.getSquadRating(players);
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
        })
        
        let newState = Object.assign({}, state, data, { teams, players, nextPlayerId, fixtures });
    
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


// WEBPACK FOOTER //
// src/reducers/GameSetupReducer.js