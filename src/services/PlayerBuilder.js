import Randomizer from '../utils/Randomizer';
import firstNames from '../data/first-names.json';
import surnames from '../data/surnames.json';

export default class PlayerBuilder{
    
    constructor(){
        this.randomizer = new Randomizer();
    }
    
    buildDraftPlayer(id){
        const ability = this.randomizer.getRandomInteger(20, 60);
        const name = this.randomizer.getRandomItem(firstNames) + ' ' + this.randomizer.getRandomItem(surnames);
        return {
            id,
            teamId: undefined, 
            name, 
            salary: 2.5, 
            contractExpiry: undefined, 
            ability
        }
    }
}