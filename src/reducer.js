import { LOAD_GAME_DATA, SET_TEAM, SAVE_RESULTS, END_SEASON, ADD_LOG_MESSAGE, REMOVE_LOG_MESSAGE } from './actions';
import { GAME_STATE_REGULAR_SEASON, GAME_STATE_END_OF_SEASON } from './constants';

const initialState = {
    gameState: {
        stage: GAME_STATE_REGULAR_SEASON,
        round: 0,
        teamId: undefined,
        logMessages: []
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_GAME_DATA: {
            const {data} = action;
            return Object.assign({}, state, data);
        }
        case SET_TEAM: {
            const {teamId} = action;
            const gameState = Object.assign({}, state.gameState, { teamId });
            return Object.assign({}, state, { gameState });
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
            return Object.assign({}, state, { standings, gameState });
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
        default: return state;
    }
};

export default reducer;