import PlayerBuilder from '../services/PlayerBuilder';

export default class DraftService{
    
    constructor(randomizer){
        this.playerBuilder = new PlayerBuilder(randomizer);
    }
    
    createDraftClass(year, nextId, size){
        const draftClass = [];
        for(let i=0; i< size; i++){
            const player = this.playerBuilder.buildDraftPlayer(year, nextId++);
            draftClass.push(player);
        }
        draftClass.sort((a, b) => b.potential - a.potential);
        return draftClass;
    }
    
}


// WEBPACK FOOTER //
// src/services/DraftService.js