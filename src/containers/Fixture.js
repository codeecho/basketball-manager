import { connect } from 'react-redux';
import Fixture from '../pages/Fixture';

const mapStateToProps = (state, ownProps) => {

    const round = ownProps.match.params.round * 1;
    const id = ownProps.match.params.id * 1;    
    
    const fixture = state.fixtures[round].find(fixture => fixture.id === id);
    
    const homeTeam = state.teams.find(team => team.id === fixture.homeId);
    const awayTeam = state.teams.find(team => team.id === fixture.awayId);

    const homePlayers = fixture.homePlayerRatings.map(ratings => {
        const player = state.players.find(player => player.id === ratings.playerId);
        return Object.assign({}, player, {ratings});
    });
    
    const awayPlayers = fixture.awayPlayerRatings.map(ratings => {
        const player = state.players.find(player => player.id === ratings.playerId);
        return Object.assign({}, player, {ratings});
    });

    return {
        fixture,
        homeTeam,
        awayTeam,
        homePlayers,
        awayPlayers
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  };
};

const FixtureContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Fixture);

export default FixtureContainer;