import Randomizer from '../utils/Randomizer';
import firstNames from '../data/first-names.json';
import surnames from '../data/surnames.json';
import PlayerService from './PlayerService';

import {UNDRAFTED_TEAM_ID} from '../constants';

const positions = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'GF', 'FC']

export default class PlayerBuilder{
    
    constructor(randomizer){
        this.randomizer = randomizer || new Randomizer();
        this.playerService = new PlayerService();
    }
    
    calculateAbility(stamina, scoring, defense, rebounding, passing){
        const attrs = [defense, rebounding, passing];
        attrs.sort((a,b) => b - a);
        //return Math.round((stamina*2 + scoring*4 + attrs[0]*2 + attrs[1]*2)/10);
        return Math.round((stamina + scoring + defense + rebounding + passing)/5);
    }
    
    buildDraftPlayer(year, id, upperBound){
        const name = this.randomizer.getRandomItem(firstNames) + ' ' + this.randomizer.getRandomItem(surnames);
        const age = this.randomizer.getRandomInteger(19, 22);
        const prime = this.randomizer.getRandomInteger(27, 30);
        const decline = this.randomizer.getRandomNumber(2, 3);
        const dob = year - age - 1;
        const position = this.randomizer.getRandomItem(positions);
        const stamina = this.randomizer.getRandomInteger(80, 95);
        let scoring = this.randomizer.getRandomInteger(25, 99);
        let defense = this.randomizer.getRandomInteger(25, 99);
        let rebounding = this.randomizer.getRandomInteger(25, 99);
        let passing = this.randomizer.getRandomInteger(25, 99);
        let ability = this.calculateAbility(stamina, scoring, defense, rebounding, passing);
        const potential = this.randomizer.getRandomInteger(50, upperBound);
        const adjustedAbility = Math.max(Math.min(Math.max(potential - 20, 40), 70) - (6*(22-age)), 40);
        const fuzzedAbility = this.randomizer.getRandomNumber(adjustedAbility - 1.5, adjustedAbility + 1.5);
        const delta = fuzzedAbility / ability;
        scoring = Math.round(scoring * delta);    
        defense = Math.round(defense * delta);    
        rebounding = Math.round(rebounding * delta);    
        passing = Math.round(passing * delta);
        const calculatedAbility = this.calculateAbility(stamina, scoring, defense, rebounding, passing);
        console.log(potential, adjustedAbility, fuzzedAbility, calculatedAbility);
        const player = {
            id,
            teamId: UNDRAFTED_TEAM_ID, 
            name, 
            dob,
            age,
            salary: 2.5, 
            contractExpiry: undefined, 
            ability: calculatedAbility,
            realAbility: calculatedAbility,
            delta: 0,
            potential,
            prime,
            decline,
            draftYear: year,
            position,
            stamina,
            scoring,
            defense,
            rebounding,
            passing
        };
        const expectedSalary = this.playerService.calculateExpectedSalary(player);
        return Object.assign({}, player, {expectedSalary});
    }
}


// WEBPACK FOOTER //
// src/services/PlayerBuilder.js