import Randomizer from '../utils/Randomizer';
import firstNames from '../data/first-names.json';
import surnames from '../data/surnames.json';

export default class PlayerBuilder{
    
    constructor(){
        this.randomizer = new Randomizer();
    }
    
    buildDraftPlayer(year, id){
        const ability = this.randomizer.getRandomInteger(20, 60);
        const age = this.randomizer.getRandomInteger(19, 22);
        const dob = year - age;
        const name = this.randomizer.getRandomItem(firstNames) + ' ' + this.randomizer.getRandomItem(surnames);
        return {
            id,
            teamId: undefined, 
            name, 
            dob,
            salary: 2.5, 
            contractExpiry: undefined, 
            ability
        }
    }
}