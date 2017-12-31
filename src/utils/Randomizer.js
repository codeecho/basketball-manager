export default class Randomizer{
    
    getBoolean(){
        return this.getRandom() < 0.5;
    }
    
    getRandom(){
        return Math.random();
    }
    
}