import Randomizer from '../utils/Randomizer';

import { GAME_STATE_REGULAR_SEASON } from '../constants';

export default class GameStateBuilder{
    
    constructor(){
        this.randomizer = new Randomizer();
    }
    
    buildNewGameState(){
        return {
            options: {
                
            },
            gameState: {
                id: this.randomizer.getRandomString(6).toLowerCase(),
                stage: GAME_STATE_REGULAR_SEASON,
                round: 0,
                year: undefined,
                teamId: undefined
            },
            user: {
                id: undefined,
                name: undefined
            },
            onlineGame: {
                id: undefined,
                isHost: false,
                users: [],
                playersReady: []
            },
            playerRatings: []
        };
    }
    
}


// WEBPACK FOOTER //
// src/reducers/GameStateBuilder.js