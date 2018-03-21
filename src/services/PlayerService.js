import Randomizer from '../utils/Randomizer';

import {UNDRAFTED_TEAM_ID} from '../constants';

export default class PlayerService{
    
    applyProjectedTraining(player, years){
        let projectedPlayer = Object.assign({}, player);
        for(let i=0; i<years; i++){
            projectedPlayer.age = player.age + i;
            projectedPlayer = this.applyTraining(projectedPlayer);
        }
        return projectedPlayer;
    }
    
    applyTraining(player){
        if(player.teamId === UNDRAFTED_TEAM_ID) return player;
        const seed = player.id + player.age + player.stamina + player.scoring + player.defense + player.rebounding;
        const randomizer = new Randomizer(seed);
        const originalAbility = player.ability;
        const realDelta = this.calculateTrainingAdjustment(player);
        const realAbility = player.realAbility + realDelta;
        const ability = Math.floor(realAbility);
        let delta = ability - originalAbility;
        if(delta > 0) delta = Math.round((delta * 5) / 4);
        const potential = delta < 0 ? ability : player.potential;
        const stamina = delta < 0 ? stamina - delta : stamina;
        const attrDeltas = getAttributeDeltas(randomizer, delta);
        const scoring = player.scoring + attrDeltas[0];
        const defense = player.defense + attrDeltas[1];
        const rebounding = player.rebounding + attrDeltas[2];
        const passing = player.passing + attrDeltas[3];
        return Object.assign({}, player, {delta, ability, realAbility, potential, scoring, defense, rebounding, passing});
    }
    
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
        
        let expectedSalary = Math.pow(rating-40, 2) *0.017;
        
        // Adjust for aging players
        if(yearsToPrime < 0){
            const yearsPastPrime = 0 - yearsToPrime;
            expectedSalary = expectedSalary * Math.pow(0.92, yearsPastPrime);
        }
        
        if(player.age < 23) expectedSalary = expectedSalary / 4;
        
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

function getAttributeDeltas(randomizer, delta){
    if(delta <= 0) return [delta, delta, delta, delta];
    const total = delta * 4;
    const deltas = [];
    const lowerBand = Math.max(delta-2, 0);
    const upperBand = delta+2;
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