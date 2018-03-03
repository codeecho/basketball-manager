import PersistenceService from '../services/PersistenceService';

import { GAME_STATE_REGULAR_SEASON, GAME_STATE_PLAYOFFS, GAME_STATE_POST_SEASON } from '../constants';

export default class FixturesReducer{
    
    constructor(){
        this.persistenceService = new PersistenceService();
    }
    
    saveResults(action, state){
        const {results} = action;
        
        const standings = state.standings.concat();
        const fixtures = state.fixtures.concat();
        
        const playerRatings = state.playerRatings.concat();
        
        let roundNo = state.gameState.round;
        
        let playoffs = state.playoffs.concat();
        
        results.forEach((roundResults, i) => {
            
            const round = fixtures[roundNo+i];
            
            roundResults.forEach(result => {
                const {fixtureId, winnerId, loserId, homeScore, awayScore, homePlayerRatings, awayPlayerRatings, cancelled} = result;
                
                if(cancelled) return;
            
                const fixture = round.find(fixture => fixture.id === fixtureId);
                
                Object.assign(fixture, {winnerId, loserId, homeScore, awayScore, homePlayerRatings, awayPlayerRatings});
                
                if(state.gameState.stage === GAME_STATE_REGULAR_SEASON){
                
                    const winnerStanding = standings.find(standing => standing.teamId === winnerId);
                    winnerStanding.played++;
                    winnerStanding.won++;
                    
                    const loserStanding = standings.find(standing => standing.teamId === loserId);
                    loserStanding.played++;
                    loserStanding.lost++;
                
                }else if(state.gameState.stage === GAME_STATE_PLAYOFFS){
                    const playoffRound = playoffs[playoffs.length-1];
                    const playoffFixture = playoffRound.find(round => round.id === fixtureId);
                    if(playoffFixture.homeId === winnerId) playoffFixture.homeWins += 1;
                    if(playoffFixture.awayId === winnerId) playoffFixture.awayWins += 1;
                    playoffFixture.played += 1;
                    playoffFixture.homeScore += homeScore;
                    playoffFixture.awayScore += awayScore;
                    if(state.options.playoffType === 'BBL'){
                        if(playoffFixture.played === 2 || (playoffRound.length === 1 && playoffFixture.played === 1)){
                            if(playoffFixture.homeScore > playoffFixture.awayScore) playoffFixture.winnerId = playoffFixture.homeId;
                            else playoffFixture.winnerId = playoffFixture.awayId;
                        }
                    }else{
                        if(playoffFixture.homeWins === 4) playoffFixture.winnerId = playoffFixture.homeId;
                        if(playoffFixture.awayWins === 4) playoffFixture.winnerId = playoffFixture.awayId;                        
                    }
                }
                
                updatePlayerRatings(playerRatings, homePlayerRatings);
                updatePlayerRatings(playerRatings, awayPlayerRatings);                
                
            });
            
        });
        
        standings.sort((a, b) => b.won - a.won);
        
        roundNo = roundNo + results.length;
        
        const gameState = Object.assign({}, state.gameState, { round: roundNo });
        const newState = Object.assign({}, state, { standings, gameState, fixtures, playerRatings, playoffs });
        
        return newState;
    }
    
}

function updatePlayerRatings(playerRatings, teamRatings){
    teamRatings.forEach(ratings => {
        const {playerId, points, assists, rebounds} = ratings;
        let existingRatings = playerRatings.find(x => x.playerId === playerId);
        if(!existingRatings){
            existingRatings = { playerId, games: 0, ppg: 0, apg: 0, rpg: 0};
            playerRatings.push(existingRatings);
        }
        const {games, ppg, apg, rpg} = existingRatings;
        existingRatings.ppg = roundTo2dp(((ppg * games) + points) / (games+1));
        existingRatings.apg = roundTo2dp(((apg * games) + assists) / (games+1));
        existingRatings.rpg = roundTo2dp(((rpg * games) + rebounds) / (games+1)); 
        existingRatings.games = games + 1;
    });
}

function roundTo2dp(n){
    return Math.round(n*100)/100;
}


// WEBPACK FOOTER //
// src/reducers/FixturesReducer.js