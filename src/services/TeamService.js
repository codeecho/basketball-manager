export default class TeamService{
    
    calculatePayroll(players){
        let payroll = 0;
        players.forEach(player => payroll += player.salary);
        return payroll;
    }
    
    getLineup(players){
        players = players.concat();
        
        const lineup = {
            starters: [],
            secondUnit: [],
            reserves: []
        };
        
        if(players.length <= 5) {
            lineup.starters = players;
            return lineup;
        }
        
        players.sort((a,b) => b.ability - a.ability);
        
        lineup.starters = players.splice(0, 5);
        
        if(players.length <= 5) {
            lineup.secondUnit = players;
            return lineup;
        }
        
        lineup.secondUnit = players.splice(0, 5);
        lineup.reserves = players;
        
        return lineup;
    }
    
    getLineupRating(lineup){
        const startersAvgAbility = getAverageAbility(lineup.starters);
        const secondUnitAvgAbility = getAverageAbility(lineup.secondUnit);
        return (startersAvgAbility * 0.7) + (secondUnitAvgAbility * 0.3);
    }
    
}

function getAverageAbility(players){
    if(players.length === 0) return 0;
    return players.reduce((total, player) => total + player.ability, 0) / players.length;
}