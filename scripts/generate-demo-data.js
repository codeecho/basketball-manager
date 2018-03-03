const fs = require('fs');

const sourceData = require('./2017-18.NBA.Roster.json');

const firstNames = require('../src/data/first-names.json');
const surnames = require('../src/data/surnames.json');

const baseData = {
    "options": {
        "startYear": 2018,
        "salaryCap": 150,
        "numberOfPlayoffTeams": 4,
        "playoffType": "NBA",
        "draftType": "NBA"
    },
    "nextPlayerId": 10000,
    "seed": 1
}

let bblTeamMappings = {
    'Warriors': {
        name: 'Leicester Riders'
    },
    'Cavaliers': {
        name: 'Newcastle Eagles'
    },
    'Celtics': {
        name: 'Surrey Scorchers'
    },
    'Hawks': {
        name: 'Leeds Force'
    },
    'Bulls': {
        name: 'Manchester Giants'
    },
    'Magic': {
        name: 'Plymouth Raiders'
    },
    'Pistons': {
        name: 'Bristol Flyers'
    },
    'Knicks': {
        name: 'Cheshire Phoenix'
    },
    'Timberwolves': {
        name: 'London Lions'
    },
    'Hornets': {
        name: 'Worchester Wolves'
    },
    'Rockets': {
        name: 'Glasgow Rocks'
    },
    'Raptors': {
        name: 'Sheffield Sharks'
    },    
}

let bblPlayerMappings = {
    'Kyrie Irving': {
        name: 'Tony Hicks'
    },
    'Al Horford': {
        name: 'Tayo Ogedengbe'
    },
    'Gordon Hayward': {
        name: 'Alex Owumi'
    },
    'Jaylen Brown': {
        name: 'Josh Steele'
    },    
    'Jayson Tatum': {
        name: 'Jordan Williams'
    },
    'Marcus Morris': {
        name: 'Gerald Robinson'
    },
    'Marcus Smart': {
        name: 'Elias Desport'
    },
    'Terry Rozier': {
        name: 'Levi Noel'
    },
    'Abdel Nader': {
        name: 'Caylin Raftopoulos'
    }
}

const year = 2018;

function calculateGMAbility(ratings) {
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

function calculateScoringAbility(ratings){
    const {hgt, spd, stre, ins, dnk, tp, fg, jmp} = ratings;
    return Math.round((hgt*2 + stre + spd*2 + ins*3 + dnk*4 + tp*2 + fg*2) / 16);
//    const attrs = [ins, dnk, tp, fg];
//    attrs.sort((a, b) => b - a);
//    return (attrs[0] + attrs[1] + attrs[2])/3;
}

function calculateDefensiveAbility(ratings){
    const {hgt, blk, reb, stl, jmp, stre, spd} = ratings;
    const attrs = [blk, stl];
    attrs.sort((a,b) => b-a);
    return Math.round((attrs[0]*4 + attrs[1]*2 + hgt*2 + stre + spd) / 10);
}

function calculateRebounding(ratings){
    const {hgt, jmp, reb} = ratings;
    return Math.round((hgt*2 + reb*2 + jmp)/5);
}

function calculatePassing(ratings){
    const {drb, pss, spd, stre} = ratings;
    return Math.round((100 + drb + pss*3 + spd + stre)/8);
}

function calculateAbility(stamina, scoring, defense, rebounding, passing){
    const attrs = [defense, rebounding, passing];
    attrs.sort((a,b) => b - a);
    //return Math.round((stamina*2 + scoring*4 + attrs[0]*2 + attrs[1]*2)/10);
    return Math.round((stamina + scoring + defense + rebounding + passing)/5);
}

function massageRating(rating){
    rating = rating * 1.075;
    if(rating > 99) rating = 99;
    return Math.round(rating);
}

function getRandomName(){
    let n1 = Math.round(Math.random() * firstNames.length);
    let n2 = Math.round(Math.random() * surnames.length);
    const firstName = firstNames[n1];
    const surname = surnames[n2];
    const name = firstName + " " + surname;
    return name;
}

function generateDataFile(teamNames, teamMappings = {}, playerMappings = {}, useRandomNames = false, options = {}, outputFile){
    const teams = sourceData.teams
    .filter(team => !teamNames || teamNames.includes(team.name))
    .map((team, i) => {
        const id = team.tid + 1;
        const name = `${team.region} ${team.name}`;
        const mapping = teamMappings[team.name] || {};
        return Object.assign({id, name}, mapping);
    });
    
    const teamIds = teams.map(team => team.id);
    
    const players = sourceData.players
    .filter(player => [0].concat(teamIds).includes(player.tid+1))
    .map((player, i) => {
        const id = i;
        const teamId = player.tid < 0 ? player.tid : player.tid + 1;
        const name = useRandomNames ? getRandomName() : player.name;
        const dob = player.born.year;
        const age = year - 1 - dob;
        const contractExpiry = player.contract.exp;
        const prime = 30;
        const ratings = player.ratings[0];
        let potential = ratings.pot;
        const stamina = ratings.endu;
        const scoring = massageRating(calculateScoringAbility(ratings));
        const defense = massageRating(calculateDefensiveAbility(ratings));
        const rebounding = massageRating(calculateRebounding(ratings));
        const passing = massageRating(calculatePassing(ratings));
        const gmAbility = calculateGMAbility(ratings);
        const ability = calculateAbility(stamina, scoring, defense, rebounding, passing);
        potential = potential + (ability - gmAbility);
        if(age >= prime || potential < ability) potential = ability;
        if(age < prime) potential = Math.min(potential, ability + ((prime-age)*5));
        if(gmAbility > 60){
            //console.log(stamina, scoring, defense, rebounding, passing, ability, gmAbility, potential, name);
        }
        const decline = 2.5;
        const draftYear = player.draft.year || 1970;
        const position = calculatePosition(ratings);
        const output = {
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
            position,
            scoring,
            defense,
            rebounding,
            passing,
            stamina
        };
        const mapping = playerMappings[player.name] || {};
        return Object.assign(output, mapping);
    });
    
    const standings = teams.map(team => ({ teamId: team.id, played: 0, won: 0, lost: 0}));
        
    const bData = Object.assign({}, baseData, {options});
        
    const data = Object.assign({}, bData, { teams, players, standings });
    
    fs.writeFileSync(outputFile, JSON.stringify(data));
}

const testTeamNames = ['Cavaliers', 'Warriors', 'Hawks', 'Timberwolves'];
const bblTeamNames = ['Cavaliers', 'Warriors', 'Hawks', 'Timberwolves', 'Celtics', 'Rockets', 'Magic', 'Pistons', 'Knicks', 'Raptors', 'Hornets', 'Bulls'];
const nbaTeamNames = undefined;

const testOptions = {
    startYear: 2018,
    salaryCap: 150,
    numberOfPlayoffTeams: 4,
    playoffType: "NBA",
    draftType: "NBA"
};
const bblOptions = {
    startYear: 2018,
    salaryCap: 150,
    numberOfPlayoffTeams: 8,
    playoffType: "BBL",
    draftType: "BBL"
};
const nbaOptions = {
    startYear: 2018,    
    salaryCap: 150,
    numberOfPlayoffTeams: 16,
    playoffType: "NBA",
    draftType: "NBA"
};

generateDataFile(testTeamNames, undefined, undefined, false, testOptions, 'test.json');
generateDataFile(bblTeamNames, bblTeamMappings, bblPlayerMappings, false, bblOptions, 'bbl.json');
generateDataFile(nbaTeamNames, undefined, undefined, false, nbaOptions, 'demo.json');