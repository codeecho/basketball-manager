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

function calculatePosition(ratings) {
    let pg = false;
    let sg = false;
    let sf = false;
    let pf = false;
    let c = false;

    let position;

    // Without other skills, slot primarily by height
    if (ratings.hgt >= 59) {
        // 6'10"
        position = "C";
    } else if (ratings.hgt >= 52) {
        // 6'8"
        position = "PF";
    } else if (ratings.hgt >= 44) {
        // 6'6"
        position = "SF";
    } else if (
        ratings.spd < 70 &&
        ratings.drb < 70 &&
        ratings.pss < 70 &&
        ratings.hgt >= 35
    ) {
        position = "SG";
    } else {
        position = "PG";
    }

    // No height requirements for point guards
    // PG is a fast ball handler, or a super ball handler
    if (
        (ratings.spd >= 70 && ratings.pss + ratings.drb >= 100) ||
        (ratings.spd >= 30 && ratings.pss + ratings.drb >= 145)
    ) {
        pg = true;
    }

    // SG is secondary ball handler and at least one of: slasher or 3p shooter
    if (
        ratings.spd >= 50 &&
        ratings.drb >= 50 &&
        ratings.hgt >= 37 &&
        (ratings.dnk >= 65 || ratings.tp >= 75)
    ) {
        sg = true;
    }

    // SF is similar to SG but must be taller and has lower dribble/speed requirements
    if (
        ratings.spd >= 35 &&
        ratings.drb > 25 &&
        ratings.hgt >= 44 &&
        (ratings.dnk >= 75 || ratings.tp >= 65)
    ) {
        sf = true;
    }

    // PF must meet height/strength requirements.  If they are too tall then they are a Center only... unless they can shoot
    if (
        ratings.hgt >= 44 &&
        ratings.stre >= 60 &&
        ratings.hgt + ratings.stre >= 113 &&
        (ratings.hgt <= 63 || ratings.tp >= 70)
    ) {
        pf = true;
    }

    // C must be extra tall or is strong/shotblocker but not quite as tall
    if (
        ratings.hgt >= 63 ||
        (ratings.hgt >= 54 &&
            (ratings.hgt + ratings.stre >= 147 || ratings.blk >= 85))
    ) {
        c = true;
    }

    if (pg && !sg && !sf && !pf && !c) {
        position = "PG";
    } else if (!pg && sg && !sf && !pf && !c) {
        position = "SG";
    } else if (!pg && !sg && sf && !pf && !c) {
        position = "SF";
    } else if (!pg && !sg && !sf && pf && !c) {
        position = "PF";
    } else if (!pg && !sg && !sf && !pf && c) {
        position = "C";
    }

    // Multiple positions
    if ((pg || sg || sf) && c) {
        position = "F";
    } else if ((pg || sg) && (sf || pf)) {
        position = "GF";
    } else if (c && pf) {
        position = "FC";
    } else if (pf && sf) {
        position = "F";
    } else if (pg && sg) {
        position = "G";
    }

    return position;
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
        const draftYear = 1970;
        const position = calculatePosition(player.ratings[0]);
        return {
            id,
            teamId,
            name,
            dob,
            contractExpiry,
            potential,
            ability,
            prime,
            decline,
            draftYear,
            position
        };
    });
    
const standings = teams.map(team => ({ teamId: team.id, played: 0, won: 0, lost: 0}));
    
const data = Object.assign({}, baseData, { teams, players, standings });

fs.writeFileSync('output.json', JSON.stringify(data));