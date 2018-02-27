import { Observable } from 'rxjs';
import * as actions from '../actions';
import Randomizer from '../utils/Randomizer';
import stateSelector from '../utils/stateSelector';
import TeamService from '../services/TeamService';

import {toast} from 'react-toastify';

const teamService = new TeamService();

export const playNextRoundEpic = (action$, store) =>
  action$
    .filter(action => action.type === actions.PLAY_NEXT_ROUND)
    .debounceTime(0)
    .switchMap(({numberOfRounds, seed}) => {
        
        const randomizer = new Randomizer(seed);
        
        const state = store.getState();
        const {gameState, teams} = state;
        const {teamId} = gameState;
        
        const round = state.gameState.round;
        
        const results = [];
        
        for(let i=0; i < numberOfRounds; i++){
            const roundNo = round + i;
            
            if(state.fixtures.length <= roundNo) break;
            
            const fixtures = state.fixtures[roundNo];
            
            const roundResults = fixtures.map(fixture => {
                const {homeId, awayId, id} = fixture;
                
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
                
                return {
                   fixtureId: id,
                   winnerId: winner.id,
                   loserId: loser.id,
                   homeScore,
                   awayScore,
                   homePlayerRatings,
                   awayPlayerRatings
                }
            }); 
            
            results.push(roundResults);
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
    
    const baseScore = Math.round(120 + 50 - bestDefense);
    
    const isUpset = (homeWin && homeRatings.overall <= awayRatings.overall) || (!homeWin && homeRatings.overall >= awayRatings.overall);
    
    let margin = 1;
    
    if(isUpset){
        margin = randomizer.getRandomInteger(1, 5);
    }else{
        const marginTarget = Math.round(Math.abs((0.5-chanceOfHomeWin)) * 60);
        const lowerBound = Math.max(marginTarget - 3, 1);
        const upperBound = Math.min(marginTarget + 3, 20);
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
    
    const startersPoints = Math.round(totalPoints * 0.8);
    const benchPoints = totalPoints - startersPoints;
    
    const totalAssists = randomizer.getRandomInteger(20, 30);
    const startersAssists = Math.round(totalAssists * 0.8);
    const benchAssists = totalAssists - startersAssists;
    
    const totalRebounds = randomizer.getRandomInteger(30, 50);
    const startersRebounds = Math.round(totalRebounds * 0.7);
    const benchRebounds = totalRebounds - startersRebounds;
    
    const points = getPointsPerPlayer(starters, startersPoints).concat(getPointsPerPlayer(secondUnit, benchPoints));
    const rebounds = getReboundsPerPlayer(starters, startersRebounds).concat(getReboundsPerPlayer(secondUnit, benchRebounds));
    const assists = getAssistsPerPlayer(starters, startersAssists).concat(getAssistsPerPlayer(secondUnit, benchAssists));
    
    return starters.concat(secondUnit).map(player => {
        return {
            playerId: player.id,
            points: points.find(x => x.playerId == player.id).points,
            rebounds: rebounds.find(x => x.playerId == player.id).rebounds,
            assists: assists.find(x => x.playerId == player.id).assists       
        }
    });
}

function getReboundsPerPlayer(players, totalRebounds){
    return getStatPerPlayer(players, 'rebounding', 'rebounds', totalRebounds, [0.3, 0.25, 0.15, 0.15, 0.15]);
}

function getAssistsPerPlayer(players, totalAssists){
    return getStatPerPlayer(players, 'passing', 'assists', totalAssists, [0.6, 0.25, 0.1, 0.05, 0]);
}

function getPointsPerPlayer(players, totalPoints){
    return getStatPerPlayer(players, 'scoring', 'points', totalPoints, [0.35, 0.25, 0.2, 0.1, 0.1]);
}

function getStatPerPlayer(players, statProperty, resultProperty, totalPoints, usageRates){
   
    players = players.concat();
    players.sort((a, b) => b[statProperty] - a[statProperty]);
    
    players.forEach((player, i) => {
        const multiplier = 1 - 0.2 + usageRates[i];
        player.adjustedStat = Math.max(player[statProperty] -50, 1) * multiplier;
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
        }
    });
}


// WEBPACK FOOTER //
// src/epics/playNextRoundEpic.js