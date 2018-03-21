import { Observable } from 'rxjs';
import * as actions from '../actions';
import Randomizer from '../utils/Randomizer';
import stateSelector from '../utils/stateSelector';
import TeamService from '../services/TeamService';

import {GAME_STATE_REGULAR_SEASON, GAME_STATE_PLAYOFFS} from '../constants';

import {toast} from 'react-toastify';

const teamService = new TeamService();

export const playNextRoundEpic = (action$, store) =>
  action$
    .filter(action => action.type === actions.PLAY_NEXT_ROUND)
    .switchMap(({numberOfRounds, playThroughPlayoffs, seed}) => {
        
        const randomizer = new Randomizer(seed);
        
        const state = store.getState();
        const {gameState, teams} = state;
        const {teamId} = gameState;
        
        const round = state.gameState.round;
        
        const results = [];
        
        const playoffRound = state.playoffs.length > 0 ? state.playoffs[state.playoffs.length-1].map(fixture => Object.assign({}, fixture)) : [];
        
        for(let i=0; i < numberOfRounds; i++){
            const roundNo = round + i;
            
            if(state.fixtures.length <= roundNo) break;
            
            const fixtures = state.fixtures[roundNo];
            
            const roundResults = fixtures.map(fixture => {
                const {homeId, awayId, id} = fixture;
                
                if(state.gameState.stage === GAME_STATE_PLAYOFFS && state.options.playoffType !== 'BBL'){
                    const playoffFixture = playoffRound.find(fixture => fixture.id === id);
                    if(playoffFixture.winnerId) return {fixtureId: id, cancelled: true};
                }
                
                const homeTeam = stateSelector.getTeam(state, homeId);
                const awayTeam = stateSelector.getTeam(state, awayId);
    
                const homePlayers = stateSelector.getTeamPlayers(state, homeId);
                const awayPlayers = stateSelector.getTeamPlayers(state, awayId);            
                
                const result = getResult(randomizer, homeTeam, awayTeam, homePlayers, awayPlayers);
                
                const {winner, loser, homeScore, awayScore, homePlayerRatings, awayPlayerRatings} = result;
                
                if(teamId === winner.id){
                    toast.success(` W - ${loser.name} ${awayScore} - ${homeScore}`);
                }else if(teamId === loser.id){
                    toast.error(` L - ${winner.name} ${awayScore} - ${homeScore}`);
                }
                
                if(state.gameState.stage === GAME_STATE_PLAYOFFS && state.options.playoffType !== 'BBL'){
                    const playoffFixture = playoffRound.find(fixture => fixture.id === id);
                    if(playoffFixture.homeId === winner.id) playoffFixture.homeWins += 1;
                    if(playoffFixture.awayId === winner.id) playoffFixture.awayWins += 1;
                    if(playoffFixture.homeWins === 4) playoffFixture.winnerId = playoffFixture.homeId;
                    if(playoffFixture.awayWins === 4) playoffFixture.winnerId = playoffFixture.awayId;                    
                }
                
                return {
                   fixtureId: id,
                   winnerId: winner.id,
                   loserId: loser.id,
                   homeScore,
                   awayScore,
                   homePlayerRatings,
                   awayPlayerRatings
                };
            });
            
            results.push(roundResults);
        }
        
        if(round + results.length === state.fixtures.length){
            if(state.gameState.stage === GAME_STATE_REGULAR_SEASON){
                let observables = Observable.concat(
                    Observable.of(actions.saveResults(results)),
                    Observable.of(actions.endRegularSeason()),
                    Observable.of(actions.createNextPlayoffRound(true))
                );
                if(playThroughPlayoffs) observables = Observable.concat(observables, Observable.of(actions.playNextRound(99, true, randomizer.getRandomNumber())));                
                return observables;
            }else if(state.gameState.stage === GAME_STATE_PLAYOFFS){
                if(state.fixtures[round + results.length -1].length === 1){
                    return Observable.concat(
                        Observable.of(actions.saveResults(results)),
                        Observable.of(actions.endPlayoffs())
                    );
                }
                let observables = Observable.concat(
                    Observable.of(actions.saveResults(results)),
                    Observable.of(actions.createNextPlayoffRound())
                );    
                if(playThroughPlayoffs) observables = Observable.concat(observables, Observable.of(actions.playNextRound(99, true, randomizer.getRandomNumber())));
                return observables;
            }
        }
        
        return Observable.of(actions.saveResults(results));
    });
    
function getResult(randomizer, homeTeam, awayTeam, homePlayers, awayPlayers){
    
    const homeLineup = teamService.getLineup(homePlayers);
    const awayLineup = teamService.getLineup(awayPlayers);
    
    const homeRatings = teamService.getLineupRatings(homeLineup);
    const awayRatings = teamService.getLineupRatings(awayLineup);
    
    const delta = Math.min(homeRatings.overall, awayRatings.overall) - 10;
    
    const adjustedHomeRating = Math.pow(Math.max(homeRatings.overall - delta + 0.5, 1), 4);
    const adjustedAwayRating = Math.pow(Math.max(awayRatings.overall - delta, 1), 4);
    
    const chanceOfHomeWin = adjustedHomeRating / (adjustedHomeRating + adjustedAwayRating);
    
    const homeWin = randomizer.getRandomBoolean(chanceOfHomeWin);
    
    const bestDefense = Math.max(homeRatings.defensiveRating, awayRatings.defensiveRating, 50);
    
    const baseScore = Math.round(165 - bestDefense);
    
    const isUpset = (homeWin && homeRatings.overall <= awayRatings.overall) || (!homeWin && homeRatings.overall >= awayRatings.overall);
    
    let margin = 1;
    
    if(isUpset){
        margin = randomizer.getRandomInteger(1, 5);
    }else{
        const marginTarget = Math.round(Math.abs((0.5-chanceOfHomeWin)) * 60);
        const lowerBound = Math.max(marginTarget - 3, 1);
        const upperBound = Math.min(marginTarget + 3, 15);
        margin = randomizer.getRandomInteger(lowerBound, upperBound);
    }
    
    margin = Math.max(margin, 1);
    
    const winner = homeWin ? homeTeam : awayTeam;
    const loser = homeWin ? awayTeam: homeTeam;
    
    const homeScore = homeWin ? baseScore + margin : baseScore - margin;
    const awayScore = (baseScore*2) - homeScore;
    
    const homePlayerRatings = getPlayerRatings(randomizer, homeLineup, homeScore);
    const awayPlayerRatings = getPlayerRatings(randomizer, awayLineup, awayScore);
    
    return {
        winner,
        loser,
        homeScore,
        awayScore,
        homePlayerRatings,
        awayPlayerRatings
    };
}

function getPlayerRatings(randomizer, lineup, totalPoints){
    const ratings = [];
    
    const {starters, secondUnit} = lineup;
    
    const startersPoints = Math.round(totalPoints * 0.75);
    const benchPoints = totalPoints - startersPoints;
    
    const totalAssists = Math.max(Math.min(Math.round(totalPoints/4), 35), 20);
    const startersAssists = Math.round(totalAssists * 0.75);
    const benchAssists = totalAssists - startersAssists;
    
    const totalRebounds = randomizer.getRandomInteger(35, 55);
    const startersRebounds = Math.round(totalRebounds * 0.7);
    const benchRebounds = totalRebounds - startersRebounds;
    
    const points = getPointsPerPlayer(randomizer, starters, startersPoints).concat(getPointsPerPlayer(randomizer, secondUnit, benchPoints));
    const rebounds = getReboundsPerPlayer(randomizer, starters, startersRebounds).concat(getReboundsPerPlayer(randomizer, secondUnit, benchRebounds));
    const assists = getAssistsPerPlayer(randomizer, starters, startersAssists).concat(getAssistsPerPlayer(randomizer, secondUnit, benchAssists));
    
    return starters.concat(secondUnit).map(player => {
        return {
            playerId: player.id,
            points: points.find(x => x.playerId == player.id).points,
            rebounds: rebounds.find(x => x.playerId == player.id).rebounds,
            assists: assists.find(x => x.playerId == player.id).assists       
        }
    });
}

function getReboundsPerPlayer(randomizer, players, totalRebounds){
    return getStatPerPlayer(randomizer, players, 'rebounding', 'rebounds', totalRebounds, [0.3, 0.25, 0.15, 0.15, 0.15]);
}

function getAssistsPerPlayer(randomizer, players, totalAssists){
    return getStatPerPlayer(randomizer, players, 'passing', 'assists', totalAssists, [0.6, 0.25, 0.1, 0.05, 0]);
}

function getPointsPerPlayer(randomizer, players, totalPoints){
    return getStatPerPlayer(randomizer, players, 'scoring', 'points', totalPoints, [0.4, 0.3, 0.2, 0.1, 0]);
}

function getStatPerPlayer(randomizer, players, statProperty, resultProperty, totalPoints, usageRates){
   
    players = players.concat();
    players.sort((a, b) => b[statProperty] - a[statProperty]);
    
    const ratingDelta = Math.min(...players.map(player => player[statProperty])) - 10;
    
    const isStandout = randomizer.getRandomBoolean(0.2);
    
    if(isStandout){
        const standoutIndex = randomizer.getRandomWeightedIndex([0.5, 0.25, 0.15, 0.1]);
        usageRates = [0.05, 0.05, 0.05, 0.05, 0.05];
        usageRates[standoutIndex] = 0.8;
    }
    
    players.forEach((player, i) => {
        const multiplier = 1 - 0.2 + usageRates[i];
        player.adjustedStat = Math.max(player[statProperty] - ratingDelta, 1) * multiplier;
    });
    
    const totalStat = players.reduce((total, player) => total + player.adjustedStat, 0);
    
    let availablePoints = totalPoints;
    
    return players.map((player) => {
        const ratio = player.adjustedStat / totalStat;
        const points = Math.min(Math.round(totalPoints * ratio), availablePoints);
        availablePoints -= points;
        return {
            playerId: player.id,
            [resultProperty]: points
        };
    });
}


// WEBPACK FOOTER //
// src/epics/playNextRoundEpic.js