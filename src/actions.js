export const NOOP = 'NOOP';

export const ERROR = 'ERROR';

export const LOAD_DEMO_DATA = 'LOAD_DEMO_DATA';
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
export const END_SEASON = 'END_SEASON';

export const SIGN_FREE_AGENT = 'SIGN_FREE_AGENT';
export const EXTEND_CONTRACT = 'EXTEND_CONTRACT';
export const RELEASE_PLAYER = 'RELEASE_PLAYER';
export const SET_TRADE_PROPOSAL = 'SET_TRADE_PROPOSAL';
export const COMPLETE_TRADE = 'COMPLETE_TRADE';

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

export function serverJoinRoom(room, user){
    return { type: SERVER_JOIN_ROOM, room, user };
}
export function serverPlayerReady(){
    return { type: SERVER_PLAYER_READY };
}
export function serverAdvance(seed){
    return { type: SERVER_ADVANCE, seed };
}