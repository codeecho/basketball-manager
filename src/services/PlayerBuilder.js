import Randomizer from '../utils/Randomizer';
import firstNames from '../data/first-names.json';
import surnames from '../data/surnames.json';
import PlayerService from './PlayerService';

const positions = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'GF', 'FC']

export default class PlayerBuilder{
    
    constructor(randomizer){
        this.randomizer = randomizer || new Randomizer();
        this.playerService = new PlayerService();
    }
    
    buildDraftPlayer(year, id){
        const ability = this.randomizer.getRandomInteger(20, 60);
        const potential = this.randomizer.getRandomInteger(ability, 95);
        const age = this.randomizer.getRandomInteger(19, 22);
        const prime = this.randomizer.getRandomInteger(25, 30);
        const decline = 2.5;
        const dob = year - age;
        const name = this.randomizer.getRandomItem(firstNames) + ' ' + this.randomizer.getRandomItem(surnames);
        const position = this.randomizer.getRandomItem(positions);
        const player = {
            id,
            teamId: undefined, 
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
            position
        };
        const expectedSalary = this.playerService.calculateExpectedSalary(player);
        return Object.assign({}, player, {expectedSalary});
    }
}