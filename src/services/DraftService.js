import PlayerBuilder from '../services/PlayerBuilder';

export default class DraftService{
    
    constructor(randomizer){
        this.randomizer = randomizer;
        this.playerBuilder = new PlayerBuilder(randomizer);
    }
    
    createDraftClass(year, nextId, size){
        const draftClass = [];
        const firstRange = this.randomizer.getRandomInteger(1, size/10);
        const secondRange = this.randomizer.getRandomInteger(size/10, size/5);
        const remainder = size - firstRange - secondRange;
        for(let i=0; i< firstRange; i++){
            const player = this.playerBuilder.buildDraftPlayer(year, nextId++, 95);
            draftClass.push(player);
        }
        for(let i=0; i< secondRange; i++){
            const player = this.playerBuilder.buildDraftPlayer(year, nextId++, 85);
            draftClass.push(player);
        }
        for(let i=0; i< remainder; i++){
            const player = this.playerBuilder.buildDraftPlayer(year, nextId++, 70);
            draftClass.push(player);
        }
        draftClass.sort((a, b) => b.potential - a.potential);
        return draftClass;
    }
    
}


// WEBPACK FOOTER //
// src/services/DraftService.js