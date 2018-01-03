import { Observable } from 'rxjs';
import * as actions from '../actions';
import Randomizer from '../utils/Randomizer';
import { GAME_STATE_REGULAR_SEASON, GAME_STATE_END_OF_SEASON } from '../constants';

const randomizer = new Randomizer();

export const advanceEpic = (action$, store) =>
  action$
    .filter(action => action.type === actions.ADVANCE)
    .debounceTime(0)
    .switchMap(({seed}) => {
        const state = store.getState();
        
        const stage = state.gameState.stage
        
        if(stage === GAME_STATE_REGULAR_SEASON){
            return Observable.of(actions.playNextRound(seed));   
        }else if(stage === GAME_STATE_END_OF_SEASON){
            return Observable.of(actions.endSeason(seed));               
        }
    });