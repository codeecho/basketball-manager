import Randomizer from '../utils/Randomizer';
import TeamService from './TeamService';

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
        const {requested, offered, fromTeam, toTeam} = proposal;
        
        if(offered.players.length === 0) return { acceptable: false };
        
        const toTeamRatings = this.getTeamRatingsForTrade(toTeam.id, requested, offered);
        const fromTeamRatings = this.getTeamRatingsForTrade(fromTeam.id, offered, requested);
        
        if(toTeamRatings.newRating < toTeamRatings.existingRating) { acceptable: false. toTeamRatings, fromTeamRatings };

        return { acceptable: true, toTeamRatings, fromTeamRatings };
    }
    
    getTeamRatingsForTrade(teamId, requested, offered){
        const existingPlayers = this.players.filter(player => player.teamId === teamId);
            
        const existingRating = this.teamService.getSquadRating(existingPlayers);
        
        const playersAfterTrade = existingPlayers.filter(player => !requested.players.includes(player)).concat(offered.players);
        
        const newRating = this.teamService.getSquadRating(playersAfterTrade);
        
        return {existingRating, newRating};
    }
    
}


// WEBPACK FOOTER //
// src/services/TradeService.js