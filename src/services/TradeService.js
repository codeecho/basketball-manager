import Randomizer from '../utils/Randomizer';
import TeamService from './TeamService';

import {STRATEGY_TITLE_CONTENDERS, STRATEGY_TITLE_HOPEFULS, STRATEGY_PLAYOFF_CONTENDERS, 
    STRATEGY_PLAYOFF_HOPEFULS, STRATEGY_REBUILDING, STRATEGY_TANKING} from '../constants';

export default class TradeService{
    
    constructor(teams, players){
        this.teams = teams;
        this.players = players;
        this.randomizer = new Randomizer();
        this.teamService = new TeamService();
    }
    
    getTradeProposals(teams, players, requested){
        const proposingTeams = this.randomizer.getRandomItems(teams, 5);
        const proposals = proposingTeams.map(team => {
            const teamPlayers = players.filter(player => player.teamId === team.id);
            const offeredPlayer = this.randomizer.getRandomItem(teamPlayers);
            return {
                requested,
                team,
                offered: {
                players: [offeredPlayer]
                }
            }
        });
        return proposals;
    }
    
    assessTrade(proposal){
        const {requested, offered, fromTeam, toTeam, year} = proposal;
        
        if(offered.players.length + offered.picks.length === 0) return { acceptable: false };
        
        if(requested.picks.length > 2) return { acceptable: false };
        
        const toTeamRatings = this.getTeamRatingsForTrade(year, toTeam, requested, offered, fromTeam.ranking);
        const fromTeamRatings = this.getTeamRatingsForTrade(year, fromTeam, offered, requested, toTeam.ranking, true);
        
        if(toTeamRatings.newRating <= toTeamRatings.existingRating) { acceptable: false. toTeamRatings, fromTeamRatings };

        return { acceptable: true, toTeamRatings, fromTeamRatings };
    }
    
    getTeamRatingsForTrade(year, team, requested, offered, otherTeamRanking, overrideYears){
        
        const projectionYears = overrideYears ? 0 : getProjectionYearsFromStrategy(team.strategy);
        
        const teamId = team.id;
        
        const existingPlayers = this.players
            .filter(player => player.teamId === teamId);
            
        const playersBeforeTrade = existingPlayers
            .concat(convertDraftPicksToPlayers(requested.picks, team.ranking, this.teams.length, year));
            
        const existingRating = this.teamService.getProjectedSquadRating(playersBeforeTrade, projectionYears);
        
        const playersAfterTrade = existingPlayers.
            filter(player => !requested.players.includes(player))
            .concat(offered.players)
            .concat(convertDraftPicksToPlayers(offered.picks, otherTeamRanking, this.teams.length, year));
        console.log(team.name, playersAfterTrade);
        
        const newRating = this.teamService.getProjectedSquadRating(playersAfterTrade, projectionYears);
        
        return {existingRating, newRating};
    }
    
}

function getProjectionYearsFromStrategy(strategy){
    switch(strategy){
        case STRATEGY_TITLE_CONTENDERS: return 0;
        case STRATEGY_TITLE_HOPEFULS: return 1;
        case STRATEGY_PLAYOFF_CONTENDERS: return 3;
        case STRATEGY_PLAYOFF_HOPEFULS: return 4;        
        case STRATEGY_REBUILDING: return 6;        
        case STRATEGY_TANKING: return 6;        
    }
}

function convertDraftPicksToPlayers(draftPicks, teamRanking, numberOfTeams, year){
    return draftPicks.map(pick => {
        const n = teamRanking / numberOfTeams;
        const stamina = 88;
        const ability = (40 + (n * 9) + (9 * (2-pick.round))) * (1 - (0.05 * (pick.year - year)));
        const potential = (50 + (n * 17) + (17 * (2-pick.round))) * (1 - (0.05 * (pick.year - year)));
        const skill = Math.ceil(((ability * 5) - stamina) / 4);
        return {
            teamId: 1,
            age: 21,
            prime: 29,
            stamina: 88,
            scoring: skill,
            defense: skill,
            rebounding: skill,
            passing: skill,
            ability,
            realAbility: ability,
            potential
        };
    });
}