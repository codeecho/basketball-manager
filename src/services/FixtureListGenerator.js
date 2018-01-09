export default class FixtureListGenerator{
    
    function round(n, j) {
      let m = n - 1;
      let round = Array.from({length: n}, (_, i) => (m + j - i) % m); // circular shift
      round[round[m] = j * (n >> 1) % m] = m; // swapping self-match
      return round;
    }
    
    // Schedule matches of 'n' teams:
    function fixture(n) {
      let rounds = Array.from({length: n - 1}, (_, j) => round(n, j));
      return Array.from({length: n}, (_, i) => ({
        id: "Team_" + i,
        matches: rounds.map(round => "Team_" + round[i])
      }));
    }
    
    generateFixtures(teams){
        fixtures(4);
    }
    
}

new FixtureListGenerator().generateFixtures([]);