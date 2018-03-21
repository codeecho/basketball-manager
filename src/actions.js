export const NOOP = 'NOOP';

export const ERROR = 'ERROR';

export const LOAD_DEMO_DATA = 'LOAD_DEMO_DATA';
export const LOAD_TEST_DATA = 'LOAD_TEST_DATA';
export const LOAD_BBL_DATA = 'LOAD_BBL_DATA';

export const LOAD_GAME_DATA = 'LOAD_GAME_DATA';

export const SET_TEAM = 'SET_TEAM';
export const NEW_GAME = 'NEW_GAME';

export const ADVANCE = 'ADVANCE';
export const PLAY_NEXT_ROUND = 'PLAY_NEXT_ROUND';
export const DO_DRAFT = 'DO_DRAFT';
export const APPLY_TRAINING = 'APPLY_TRAINING';
export const HANDLE_EXPIRING_CONTRACTS = 'HANDLE_EXPIRING_CONTRACTS';
export const CREATE_FREE_AGENTS = 'CREATE_FREE_AGENTS'
export const AI_SIGN_FREE_AGENTS = 'AI_SIGN_FREE_AGENTS';
export const END_REGULAR_SEASON = 'END_REGULAR_SEASON';
export const CREATE_NEXT_PLAYOFF_ROUND = 'CREATE_NEXT_PLAYOFF_ROUND';
export const END_PLAYOFFS = 'END_PLAYOFFS';
export const END_SEASON = 'END_SEASON';

export const SIGN_FREE_AGENT = 'SIGN_FREE_AGENT';
export const EXTEND_CONTRACT = 'EXTEND_CONTRACT';
export const RELEASE_PLAYER = 'RELEASE_PLAYER';
export const SET_TRADE_PROPOSAL = 'SET_TRADE_PROPOSAL';
export const COMPLETE_TRADE = 'COMPLETE_TRADE';

export const SAVE_RESULTS = 'SAVE_RESULTS';

export const HOST_ONLINE_GAME = 'HOST_ONLINE_GAME';
export const JOIN_ONLINE_GAME = 'JOIN_ONLINE_GAME';

export const SERVER_EVENT = 'SERVER_EVENT';

export const SERVER_JOIN_ROOM = 'server/JOIN_ROOM';
export const SERVER_PLAYER_READY = 'server/PLAYER_READY';
export const SERVER_ADVANCE = 'server/ADVANCE';
export const SERVER_GAME_STATE = 'server/GAME_STATE';

export const CLIENT_USER_CONNECTED = 'client/USER_CONNECTED';
export const CLIENT_USER_DISCONNECTED = 'client/USER_DISCONNECTED';
export const CLIENT_PLAYER_READY = 'client/PLAYER_READY';
export const CLIENT_ADVANCE = 'client/ADVANCE';
export const CLIENT_GAME_STATE = 'client/GAME_STATE';
export const CLIENT_SIGN_FREE_AGENT = 'client/SIGN_FREE_AGENT';
export const CLIENT_EXTEND_CONTRACT = 'client/EXTEND_CONTRACT';
export const CLIENT_RELEASE_PLAYER = 'client/RELEASE_PLAYER';
export const CLIENT_COMPLETE_TRADE = 'client/COMPLETE_TRADE';

export function noop(){
    return { type: NOOP };
}

export function error(error){
    return { type: ERROR, error };
}

export function loadTestData(){
    return { type: LOAD_TEST_DATA };
}
export function loadDemoData(){
    return { type: LOAD_DEMO_DATA };
}
export function loadBBLData(){
    return { type: LOAD_BBL_DATA };
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

export function advance(numberOfRounds, playThroughPlayoffs, seed){
    return { type: ADVANCE, numberOfRounds, playThroughPlayoffs, seed };
}
export function playNextRound(numberOfRounds, playThroughPlayoffs, seed){
    return { type: PLAY_NEXT_ROUND, numberOfRounds, playThroughPlayoffs, seed };
}
export function doDraft(seed){
    return { type: DO_DRAFT, seed };
}
export function applyTraining(seed){
    return { type: APPLY_TRAINING, seed };
}
export function handleExpiringContracts(seed){
    return { type: HANDLE_EXPIRING_CONTRACTS, seed};
}
export function createFreeAgents(seed){
    return { type: CREATE_FREE_AGENTS, seed}
}
export function aiSignFreeAgents(seed){
    return { type: AI_SIGN_FREE_AGENTS, seed};
}
export function endRegularSeason(){
    return { type: END_REGULAR_SEASON };
}
export function createNextPlayoffRound(isFirstRound){
    return { type: CREATE_NEXT_PLAYOFF_ROUND, isFirstRound };
}
export function endPlayoffs(){
    return { type: END_PLAYOFFS };
}
export function endSeason(seed){
    return { type: END_SEASON, seed };
}

export function signFreeAgent(playerId){
    return { type: SIGN_FREE_AGENT, playerId };
}
export function extendContract(playerId){
    return { type: EXTEND_CONTRACT, playerId };
}
export function setTradeProposal(proposal){
    return { type: SET_TRADE_PROPOSAL, proposal };
}
export function completeTrade(trade){
    return { type: COMPLETE_TRADE, trade };
}
export function releasePlayer(playerId){
    return { type: RELEASE_PLAYER, playerId };
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

export function serverEvent(action){
    return {type: SERVER_EVENT, action};
}

export function serverJoinRoom(room, user, teamId){
    return { type: SERVER_JOIN_ROOM, room, user, metadata: {teamId} };
}
export function serverPlayerReady(numberOfRounds, playThroughPlayoffs){
    return { type: SERVER_PLAYER_READY, numberOfRounds, playThroughPlayoffs };
}
export function serverAdvance(numberOfRounds, playThroughPlayoffs, seed){
    return { type: SERVER_ADVANCE, numberOfRounds, playThroughPlayoffs, seed };
}
export function serverGameState(users){
    return { type: SERVER_GAME_STATE, users };
}


// WEBPACK FOOTER //
// src/actions.js