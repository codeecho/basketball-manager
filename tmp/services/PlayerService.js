export default class PlayerService{
    
    calculateTrainingAdjustment(player){
        const yearsToPrime = player.prime - player.age;
        const delta = calculateTrainingAdjustment(player, yearsToPrime);
        return delta;
    }
    
    calculateExpectedSalary(player){
        const minSalary = 1;
        const maxSalary = 25;
        
        const yearsToPrime = player.prime - player.age;
        const nextDelta = calculateTrainingAdjustment(player, yearsToPrime-1);
        
        const rating = player.realAbility + nextDelta;
        
        let expectedSalary = Math.pow(rating-35, 2) *0.017;
        
        // Adjust for aging players
        if(yearsToPrime < 0){
            const yearsPastPrime = 0 - yearsToPrime;
            for(let i = 0; i < yearsPastPrime; i++){
                expectedSalary = expectedSalary * Math.pow(0.92, i+1);
            }
        }
        
        if(player.age < 23 && player.teamId < 0) expectedSalary = expectedSalary / 4;
        
        if(expectedSalary < minSalary) return minSalary;
        if(expectedSalary > maxSalary) return maxSalary;
        
        return Math.round(expectedSalary * 100) / 100;
    }
    
}

function calculateTrainingAdjustment(player, yearsToPrime){
    
    if(yearsToPrime > 0){
        return calculateTrainingImprovement(player, yearsToPrime);
    }else if(yearsToPrime < 0){
        return 0 - calculateTrainingDecline(player, 0-yearsToPrime);
    }
    
    return 0;
}

function calculateTrainingImprovement(player, yearsToPrime){   
    const remainingPotential = player.potential - player.realAbility;

    if(remainingPotential <= 0) return 0;
    
    const n = Math.pow(yearsToPrime+1, 2) / remainingPotential;
    
    const delta = remainingPotential - (Math.pow(yearsToPrime, 2) / n);
    
    return delta;
}

function calculateTrainingDecline(player, yearsPastPrime){
    const delta = Math.pow(0.15*player.decline*yearsPastPrime, 1.5);
    return delta;
}


// WEBPACK FOOTER //
// src/services/PlayerService.js