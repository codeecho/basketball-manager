import PlayerBuilder from '../services/PlayerBuilder';

export default class DraftService{
    
    constructor(){
        this.playerBuilder = new PlayerBuilder();
    }
    
    createDraftClass(nextId, size){
        const draftClass = [];
        for(let i=0; i< size; i++){
            const player = this.playerBuilder.buildDraftPlayer(nextId++);
            draftClass.push(player);
        }
        draftClass.sort((a, b) => b.ability - a.ability);
        return draftClass;
    }
    
}