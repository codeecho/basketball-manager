export const NOOP = 'NOOP';

export const ERROR = 'ERROR';

export const LOAD_DEMO_DATA = 'LOAD_DEMO_DATA';
export const LOAD_GAME_DATA = 'LOAD_GAME_DATA';
export const SET_TEAM = 'SET_TEAM';
export const NEW_GAME = 'NEW_GAME';

export const ADVANCE = 'ADVANCE';
export const PLAY_NEXT_ROUND = 'PLAY_NEXT_ROUND';
export const END_SEASON = 'END_SEASON';

export const SIGN_FREE_AGENT = 'SIGN_FREE_AGENT';

export const ADD_LOG_MESSAGE = 'ADD_LOG_MESSAGE';
export const REMOVE_LOG_MESSAGE = 'REMOVE_LOG_MESSAGE';

export const SAVE_RESULTS = 'SAVE_RESULTS';

export const HOST_ONLINE_GAME = 'HOST_ONLINE_GAME';
export const JOIN_ONLINE_GAME = 'JOIN_ONLINE_GAME';

export const SERVER_JOIN_ROOM = 'server/JOIN_ROOM';
export const SERVER_PLAYER_READY = 'server/PLAYER_READY';
export const SERVER_ADVANCE = 'server/ADVANCE';

export const CLIENT_USER_CONNECTED = 'client/USER_CONNECTED';
export const CLIENT_USER_DISCONNECTED = 'client/USER_DISCONNECTED';
export const CLIENT_PLAYER_READY = 'client/PLAYER_READY';
export const CLIENT_ADVANCE = 'client/ADVANCE';

export function noop(){
    return { type: NOOP };
}

export function error(error){
    return { type: ERROR, error };
}

export function loadDemoData(){
    return { type: LOAD_DEMO_DATA };
}
export function loadGameData(data){
    return { type: LOAD_GAME_DATA, data };
}
export function setTeam(teamId, username){
    return { type: SET_TEAM, teamId, username};
}
export function newGame(){
    return { type: NEW_GAME };
}

export function advance(seed){
    return { type: ADVANCE, seed };
}
export function playNextRound(seed){
    return { type: PLAY_NEXT_ROUND, seed };
}
export function endSeason(seed){
    return { type: END_SEASON, seed };
}

export function signFreeAgent(playerId){
    return { type: SIGN_FREE_AGENT, playerId };
}

export function addLogMessage(text){
    return { type: ADD_LOG_MESSAGE, text };
}
export function removeLogMessage(message){
    return { type: REMOVE_LOG_MESSAGE, message };
}

export function saveResults(results){
    return { type: SAVE_RESULTS, results };
}

export function hostOnlineGame(){
    return { type: HOST_ONLINE_GAME };
}
export function joinOnlineGame(gameId){
    return {type: JOIN_ONLINE_GAME, gameId };
}

export function serverJoinRoom(room, user){
    return { type: SERVER_JOIN_ROOM, room, user };
}
export function serverPlayerReady(){
    return { type: SERVER_PLAYER_READY };
}
export function serverAdvance(seed){
    return { type: SERVER_ADVANCE, seed };
}