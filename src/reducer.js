import { LOAD_GAME_DATA, SET_TEAM, SAVE_RESULTS, END_SEASON, ADD_LOG_MESSAGE, REMOVE_LOG_MESSAGE, 
    HOST_ONLINE_GAME, CLIENT_USER_CONNECTED, CLIENT_USER_DISCONNECTED, CLIENT_PLAYER_READY, JOIN_ONLINE_GAME,
    CLIENT_ADVANCE, NEW_GAME, SIGN_FREE_AGENT} from './actions';
import { GAME_STATE_REGULAR_SEASON, GAME_STATE_END_OF_SEASON } from './constants';

import Randomizer from './utils/Randomizer';

const randomizer = new Randomizer();

const currentGameId = localStorage.getItem('currentGameId');

let savedGameState;

if(currentGameId){
    savedGameState = localStorage.getItem(`savedGameState-${currentGameId}`);
    if(savedGameState) {
        savedGameState = JSON.parse(atob(savedGameState));
        savedGameState.onlineGame.id = undefined;
    };
}

const newGameState = {
    gameState: {
        id: randomizer.getRandomString(6).toLowerCase(),
        stage: GAME_STATE_REGULAR_SEASON,
        round: 0,
        teamId: undefined,
        logMessages: []
    },
    user: {
        id: undefined,
        name: undefined
    },
    onlineGame: {
        id: undefined,
        isHost: false,
        numberOfPlayers: 2,
        playersReady: []
    }
}

const initialState = savedGameState || Object.assign({}, newGameState);

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case NEW_GAME: {
            return Object.assign({}, newGameState);
        }
        case LOAD_GAME_DATA: {
            const {data} = action;
            return Object.assign({}, state, data);
        }
        case SET_TEAM: {
            const {teamId, username} = action;
            const gameState = Object.assign({}, state.gameState, { teamId });
            const userId = randomizer.getRandomString(10);
            const user = Object.assign({}, state.user, {id: userId, name: username})
            return Object.assign({}, state, { gameState, user });
        }
        case SAVE_RESULTS: {
            const {results} = action;
            const standings = state.standings.concat();
            results.forEach(result => {
                const winnerStanding = standings.find(standing => standing.teamId === result.winnerId);
                winnerStanding.played++;
                winnerStanding.won++;
                const loserStanding = standings.find(standing => standing.teamId === result.loserId);
                loserStanding.played++;
                loserStanding.lost++;
            });
            standings.sort((a, b) => b.won - a.won);
            const round = state.gameState.round + 1;
            const stage = round < state.fixtures.length ? GAME_STATE_REGULAR_SEASON : GAME_STATE_END_OF_SEASON;
            const gameState = Object.assign({}, state.gameState, { round, stage });
            const newState = Object.assign({}, state, { standings, gameState });
            localStorage.setItem('currentGameId', state.gameState.id);
            localStorage.setItem(`savedGameState-${state.gameState.id}`, btoa(JSON.stringify(newState)));
            return newState;
        }
        case END_SEASON: {
            const round = 0;
            const stage = GAME_STATE_REGULAR_SEASON;
            const gameState = Object.assign({}, state.gameState, { round, stage });
            const standings = state.standings.map(standing => Object.assign({}, standing, {played: 0, won: 0, lost: 0}));
            return Object.assign({}, state, { standings, gameState });
        }
        case ADD_LOG_MESSAGE: {
            const {text} = action;
            const message = { text };
            const logMessages = state.gameState.logMessages.concat(message);
            const gameState = Object.assign({}, state.gameState, {logMessages});
            return Object.assign({}, state, {gameState});
        }
        case REMOVE_LOG_MESSAGE: {
            const {message} = action;
            const logMessages = state.gameState.logMessages.concat();
            delete logMessages[logMessages.indexOf(message)];
            const gameState = Object.assign({}, state.gameState, {logMessages});
            return Object.assign({}, state, {gameState});
        }
        case HOST_ONLINE_GAME: {
            const onlineGame = Object.assign({}, state.onlineGame, {isHost: true});
            return Object.assign({}, state, {onlineGame});
        }
        case JOIN_ONLINE_GAME: {
            const {gameId} = action;
            const onlineGame = Object.assign({}, state.onlineGame, {id: gameId});
            return Object.assign({}, state, {onlineGame});
        }
        case CLIENT_PLAYER_READY: {
            const {user} = action;
            if(state.onlineGame.playersReady.indexOf(user.id) > -1) return state;
            const playersReady = state.onlineGame.playersReady.concat(user.id);
            const onlineGame = Object.assign({}, state.onlineGame, {playersReady});
            return Object.assign({}, state, {onlineGame});
        }
        case CLIENT_ADVANCE: {
            const playersReady = [];
            const onlineGame = Object.assign({}, state.onlineGame, {playersReady});
            return Object.assign({}, state, {onlineGame});            
        }
        case SIGN_FREE_AGENT: {
            const {playerId} = action;
            const teamId = state.gameState.teamId;
            const players = state.players.map(player => {
                if(player.id !== playerId) return player;
                return Object.assign({}, player, teamId);
            });
            return Object.assign({}, state, players);
        }
        default: return state;
    }
};

export default reducer;