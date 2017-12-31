export const NOOP = 'NOOP';

export const ERROR = 'ERROR';

export const LOAD_DEMO_DATA = 'LOAD_DEMO_DATA';
export const LOAD_GAME_DATA = 'LOAD_GAME_DATA';
export const SET_TEAM = 'SET_TEAM';

export const ADVANCE = 'ADVANCE';
export const END_SEASON = 'END_SEASON';

export const ADD_LOG_MESSAGE = 'ADD_LOG_MESSAGE';
export const REMOVE_LOG_MESSAGE = 'REMOVE_LOG_MESSAGE';

export const SAVE_RESULTS = 'SAVE_RESULTS';

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
export function setTeam(teamId){
    return { type: SET_TEAM, teamId };
}

export function advance(){
    return { type: ADVANCE };
}
export function endSeason(){
    return { type: END_SEASON };
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