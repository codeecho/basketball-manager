import Randomizer from '../utils/Randomizer';

export default class TradeService{
    
    constructor(teams, players){
        this.randomizer = new Randomizer();
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
        const {requested, offered, team} = proposal;
        if(offered.players.length === 0) return tradeRejected();
        if(requested.players.length > offered.players.length + 1) return tradeRejected();
        return tradeAccepted();
    }
    
}

function tradeRejected(){
    return { acceptable: false };
}

function tradeAccepted(){
    return { acceptable: true };
}