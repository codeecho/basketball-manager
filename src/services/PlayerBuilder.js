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
        const prime = this.randomizer.getRandomInteger(28, 31);
        const decline = 2.5;
        const dob = year - age - 1;
        const position = this.randomizer.getRandomItem(positions);
        const stamina = this.randomizer.getRandomInteger(80, 95);
        const scoring = this.randomizer.getRandomInteger(25, 60);
        const defense = this.randomizer.getRandomInteger(25, 60);
        const rebounding = this.randomizer.getRandomInteger(25, 60);
        const passing = this.randomizer.getRandomInteger(25, 60);
        const ability = this.calculateAbility(stamina, scoring, defense, rebounding, passing);
        const potential = this.randomizer.getRandomInteger(ability+5, Math.min(ability+40, Math.max(upperBound, ability)));        
        const player = {
            id,
            teamId: UNDRAFTED_TEAM_ID, 
            name, 
            dob,
            age,
            salary: 2.5, 
            contractExpiry: undefined, 
            ability,
            realAbility: ability,
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