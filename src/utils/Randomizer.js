import seedrandom from 'seedrandom';

const alphaNumericChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export default class Randomizer{
    
    constructor(seed){
        this.random = seedrandom(seed);
    }
    
    getRandomBoolean(weight = 0.5){
        return this.getRandomNumber() < weight;
    }
    
    getRandomString(length){
        var text = "";
        for(var i = 0; i < length; i++) {
            text += this.getRandomCharFromString(alphaNumericChars);
        }
        return text;
    }
    
    getRandomCharFromString(string){
        return string.charAt(this.getRandomInteger(0, string.length - 1));
    }
    
    getRandomInteger(min, max){
        return Math.round(this.getRandomNumber(min, max));
    }
    
    getRandomNumber(min = 0, max = 1){
        return min + (this.random() * max);
    }
    
}