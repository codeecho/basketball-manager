const fs = require('fs');

const sourceData = require('./2017-18.NBA.Roster.json');

const baseData = {
    "options": {
        "startYear": 2018,
        "salaryCap": 150
    },
    "nextPlayerId": 10000,
    "seed": 1,
    "fixtures": [
        [{"homeId": 1, "awayId": 5}, {"homeId": 9, "awayId": 17}],
        [{"homeId": 1, "awayId": 9}, {"homeId": 5, "awayId": 17}],
        [{"homeId": 1, "awayId": 17}, {"homeId": 5, "awayId": 9}],
        [{"homeId": 5, "awayId": 1}, {"homeId": 17, "awayId": 9}],
        [{"homeId": 9, "awayId": 1}, {"homeId": 17, "awayId": 5}],
        [{"homeId": 17, "awayId": 1}, {"homeId": 9, "awayId": 5}]
    ]

}

const teamNames = ['Cavaliers', 'Warriors', 'Celtics', 'Timberwolves'];
const numberOfFreeAgents = 10;
const year = 2018;

const teams = sourceData.teams
    .filter(team => teamNames.includes(team.name))
    .map((team, i) => {
        const id = team.tid;
        const name = `${team.region} ${team.name}`;
        return {id, name};
    });
    
const teamIds = teams.map(team => team.id);

function calculateAbility(ratings) {
    return Math.round(
        (4 * ratings.hgt +
            ratings.stre +
            4 * ratings.spd +
            2 * ratings.jmp +
            3 * ratings.endu +
            3 * ratings.ins +
            4 * ratings.dnk +
            ratings.ft +
            ratings.fg +
            2 * ratings.tp +
            ratings.blk +
            ratings.stl +
            ratings.drb +
            3 * ratings.pss +
            ratings.reb) /
            32
    );
}

const players = sourceData.players
    .filter(player => [-1].concat(teamIds).includes(player.tid))
    .map((player, i) => {
        const id = i;
        const teamId = player.tid === -1 ? null : player.tid;
        const name = player.name;
        const dob = player.born.year;
        const age = year - 1 - dob;
        const contractExpiry = player.contract.exp;
        let potential = player.ratings[0].pot;
        const ability = calculateAbility(player.ratings[0]);
        const prime = 30;
        if(age >= prime) potential = ability;
        const decline = 2.5;
        return {
            id,
            teamId,
            name,
            dob,
            contractExpiry,
            potential,
            ability,
            prime,
            decline
        };
    });
    
const standings = teams.map(team => ({ teamId: team.id, played: 0, won: 0, lost: 0}));
    
const data = Object.assign({}, baseData, { teams, players, standings });

fs.writeFileSync('output.json', JSON.stringify(data));