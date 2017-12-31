import { LOAD_GAME_DATA, SET_TEAM, SAVE_RESULTS, END_SEASON, ADD_LOG_MESSAGE, REMOVE_LOG_MESSAGE } from './actions';
import { GAME_STATE_REGULAR_SEASON, GAME_STATE_END_OF_SEASON } from './constants';

const initialState = {
    gameState: {
        stage: GAME_STATE_REGULAR_SEASON,
        round: 0,
        teamId: undefined,
        logMessages: []
    },
    teams: [
        {id: 1, name: 'Team 1'},
        {id: 2, name: 'Team 2'},
        {id: 3, name: 'Team 3'},
        {id: 4, name: 'Team 4'}
    ],
    players: [
        {id: 1, teamId: 1, name: 'Player 1'},
        {id: 2, teamId: 1, name: 'Player 2'},
        {id: 3, teamId: 1, name: 'Player 3'},
        {id: 4, teamId: 1, name: 'Player 4'},
        {id: 5, teamId: 1, name: 'Player 5'},
        {id: 6, teamId: 2, name: 'Player 6'},
        {id: 7, teamId: 2, name: 'Player 7'},
        {id: 8, teamId: 2, name: 'Player 8'},
        {id: 9, teamId: 2, name: 'Player 9'},
        {id: 10, teamId: 2, name: 'Player 10'},
        {id: 11, teamId: 3, name: 'Player 11'},
        {id: 12, teamId: 3, name: 'Player 12'},
        {id: 13, teamId: 3, name: 'Player 13'},
        {id: 14, teamId: 3, name: 'Player 14'},
        {id: 15, teamId: 3, name: 'Player 15'},
        {id: 16, teamId: 4, name: 'Player 16'},
        {id: 17, teamId: 4, name: 'Player 17'},
        {id: 18, teamId: 4, name: 'Player 18'},
        {id: 19, teamId: 4, name: 'Player 19'},
        {id: 20, teamId: 4, name: 'Player 20'},
    ],
    standings: [
        {teamId: 1, played: 0, won: 0, lost: 0},
        {teamId: 2, played: 0, won: 0, lost: 0},
        {teamId: 3, played: 0, won: 0, lost: 0},
        {teamId: 4, played: 0, won: 0, lost: 0}
    ],
    fixtures: [
        [{homeId: 1, awayId: 2}, {homeId: 3, awayId: 4}],
        [{homeId: 1, awayId: 3}, {homeId: 2, awayId: 4}],
        [{homeId: 1, awayId: 4}, {homeId: 2, awayId: 3}],
        [{homeId: 2, awayId: 1}, {homeId: 4, awayId: 3}],
        [{homeId: 3, awayId: 1}, {homeId: 4, awayId: 2}],
        [{homeId: 4, awayId: 1}, {homeId: 3, awayId: 2}]
    ]
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