export default class FixtureListGenerator{
    
    generate(teams, includeReverseFixtures = true) {

        let numberOfTeams = teams.length;
        
        // If odd number of teams add a "ghost".
        let ghost = false;
        if (numberOfTeams % 2 != 0) {
            numberOfTeams++;
            ghost = true;
        }
    
        // Generate the fixtures using the cyclic algorithm.
        const totalRounds = numberOfTeams - 1;
        const  matchesPerRound = numberOfTeams / 2;
    
        let rounds = [];
    
        for (let round = 0; round < totalRounds; round++) {
            const fixtures = [];
            for (let match = 0; match < matchesPerRound; match++) {
                const home = (round + match) % (numberOfTeams - 1);
                let away = (numberOfTeams - 1 - match + round) % (numberOfTeams - 1);
                // Last team stays in the same place while the others
                // rotate around it.
                if (match == 0) {
                    away = numberOfTeams - 1;
                }
                fixtures.push({home: teams[home], away: teams[away]});
            }
            rounds.push(fixtures);
        }
    
        // Interleave so that home and away games are fairly evenly dispersed.
        const interleaved = [];
    
        let evn = 0;
        let odd = (numberOfTeams / 2);
        for (let i = 0; i < rounds.length; i++) {
            if (i % 2 == 0) {
                interleaved.push(rounds[evn++]);
            } else {
                interleaved.push(rounds[odd++]);
            }
        }
    
        rounds = interleaved;
    
        // Last team can't be away for every game so flip them
        // to home on odd rounds.
        for (let roundNumber = 0; roundNumber < rounds.length; roundNumber++) {
            if (roundNumber % 2 == 1) {
                const fixture = rounds[roundNumber][0];
                rounds[roundNumber][0] = {home: fixture.away, away: fixture.home};
            }
        }
        
        if(includeReverseFixtures){
            const reverseFixtures = [];
            rounds.forEach(round => {
                const reverseRound = [];
                round.forEach(fixture => {
                    reverseRound.push({home: fixture.away, away: fixture.home});
                });
                reverseFixtures.push(reverseRound);
            });
            rounds = rounds.concat(reverseFixtures);
        }
    
        return rounds;
    }

}


// WEBPACK FOOTER //
// src/services/FixtureListGenerator.js