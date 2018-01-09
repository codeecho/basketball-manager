export default class PlayerService{
    
    calculateTrainingAdjustment(player){
        const yearsToPrime = player.prime - player.age;
        
        if(yearsToPrime < 0) return 0;
        
        const remainingPotential = player.potential - player.realAbility;

        if(remainingPotential <= 0) return 0;
        
        const n = Math.pow(yearsToPrime+1, 2) / remainingPotential;
        
        const delta = remainingPotential - (Math.pow(yearsToPrime, 2) / n);
        
        return delta;
    }
    
}