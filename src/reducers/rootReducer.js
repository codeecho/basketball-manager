import { LOAD_GAME_DATA, SET_TEAM, SAVE_RESULTS, END_SEASON, ADD_LOG_MESSAGE, REMOVE_LOG_MESSAGE, 
    HOST_ONLINE_GAME, CLIENT_USER_CONNECTED, CLIENT_USER_DISCONNECTED, CLIENT_PLAYER_READY, JOIN_ONLINE_GAME,
    CLIENT_ADVANCE, NEW_GAME, SIGN_FREE_AGENT, HANDLE_EXPIRING_CONTRACTS, CREATE_FREE_AGENTS, AI_SIGN_FREE_AGENTS,
    EXTEND_CONTRACT, DO_DRAFT, APPLY_TRAINING, SET_TRADE_PROPOSAL, COMPLETE_TRADE, RELEASE_PLAYER, CLIENT_GAME_STATE,
    CLIENT_SIGN_FREE_AGENT, CLIENT_EXTEND_CONTRACT, CLIENT_RELEASE_PLAYER, CLIENT_COMPLETE_TRADE} from '../actions';
    
import { GAME_STATE_REGULAR_SEASON } from '../constants';

import GameSetupReducer from './GameSetupReducer';
import OnlineGameReducer from './OnlineGameReducer';
import PlayerActionsReducer from './PlayerActionsReducer';
import SeasonReducer from './SeasonReducer';
import FixturesReducer from './FixturesReducer';

import GameStateBuilder from './GameStateBuilder';

import PersistenceService from '../services/PersistenceService';

const gameSetupReducer = new GameSetupReducer();
const onlineGameReducer = new OnlineGameReducer();
const playerActionsReducer = new PlayerActionsReducer();
const seasonReducer = new SeasonReducer();
const fixturesReducer = new FixturesReducer();

const gameStateBuilder = new GameStateBuilder();

const persistenceService = new PersistenceService();

const initialState = persistenceService.loadCurrentGame() || gameStateBuilder.buildNewGameState();

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case NEW_GAME: {
            persistenceService.newGame();
            window.location = '/';
        }
        
        case LOAD_GAME_DATA: return gameSetupReducer.loadGameData(action, state);
        case SET_TEAM: return gameSetupReducer.setTeam(action, state);
        
        case SIGN_FREE_AGENT: return playerActionsReducer.signFreeAgent(action, state);
        case EXTEND_CONTRACT: return playerActionsReducer.extendContract(action, state);
        case SET_TRADE_PROPOSAL: return playerActionsReducer.setTradeProposal(action, state);
        case COMPLETE_TRADE: return playerActionsReducer.completeTrade(action, state);
        case RELEASE_PLAYER: return playerActionsReducer.releasePlayer(action, state);
        
        case HANDLE_EXPIRING_CONTRACTS: return seasonReducer.handleExpiringContracts(action, state);
        case APPLY_TRAINING: return seasonReducer.applyTraining(action, state);
        case DO_DRAFT: return seasonReducer.doDraft(action, state);
        case CREATE_FREE_AGENTS: return seasonReducer.createFreeAgents(action, state);
        case AI_SIGN_FREE_AGENTS: return seasonReducer.aiSignFreeAgents(action, state);
        case END_SEASON: return seasonReducer.endSeason(action, state);
        
        case SAVE_RESULTS: return fixturesReducer.saveResults(action, state);
        
        case HOST_ONLINE_GAME: return onlineGameReducer.hostOnlineGame(action, state);
        case JOIN_ONLINE_GAME: return onlineGameReducer.joinOnlineGame(action, state);
        case CLIENT_PLAYER_READY: return onlineGameReducer.clientPlayerReady(action, state);
        case CLIENT_ADVANCE: return onlineGameReducer.clientAdvance(action, state);
        case CLIENT_GAME_STATE: return onlineGameReducer.clientGameState(action, state);
        
        case CLIENT_SIGN_FREE_AGENT: return playerActionsReducer.signFreeAgent(action, state);
        case CLIENT_EXTEND_CONTRACT: return playerActionsReducer.extendContract(action, state); 
        case CLIENT_RELEASE_PLAYER: return playerActionsReducer.releasePlayer(action, state);   
        case CLIENT_COMPLETE_TRADE: return playerActionsReducer.completeTrade(action, state);
        
        default: return state;
    }
};

export default rootReducer;


// WEBPACK FOOTER //
// src/reducers/rootReducer.js