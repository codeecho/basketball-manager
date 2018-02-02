import { Observable } from 'rxjs';
import * as actions from '../actions';
import Randomizer from '../utils/Randomizer';
import { GAME_STATE_REGULAR_SEASON, 
    GAME_STATE_END_OF_SEASON, 
    GAME_STATE_POST_SEASON, 
    GAME_STATE_FREE_AGENCY, 
    GAME_STATE_CONTRACT_NEGOTIATIONS,
    GAME_STATE_DRAFT} from '../constants';

const randomizer = new Randomizer();

export const advanceEpic = (action$, store) =>
  action$
    .filter(action => action.type === actions.ADVANCE)
    .debounceTime(0)
    .switchMap(({seed}) => {
        const state = store.getState();
        
        const stage = state.gameState.stage
        
        switch (stage){
            case (GAME_STATE_REGULAR_SEASON): return Observable.of(actions.playNextRound(seed));
            case (GAME_STATE_POST_SEASON): return Observable.concat(
            Observable.of(actions.doDraft(seed)), Observable.of(actions.applyTraining(seed)));
            case (GAME_STATE_DRAFT): return Observable.of(actions.handleExpiringContracts(seed));
            case (GAME_STATE_CONTRACT_NEGOTIATIONS): return Observable.of(actions.createFreeAgents(seed));            
            case (GAME_STATE_FREE_AGENCY): return Observable.of(actions.aiSignFreeAgents(seed));
            case (GAME_STATE_END_OF_SEASON): return Observable.of(actions.endSeason(seed));            
        }
    });