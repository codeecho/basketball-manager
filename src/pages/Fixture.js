import React from 'react';

import {Table} from 'react-bootstrap';

import PageWrapper from '../containers/PageWrapper';
import PlayerLink from '../components/PlayerLink';

export default function Fixture(props){
    
    const {homeTeam, awayTeam, homePlayers, awayPlayers} = props;
    
    return (
        <PageWrapper title="Fixture">
            <div>
                <div>
                    <h3>{homeTeam.name}</h3>
                    <Table striped hover>
                        <tbody>
                            {homePlayers.map(player => <PlayerRatingsRow player={player} />)}
                        </tbody>
                    </Table>
                </div>
                <div>
                    <h3>{awayTeam.name}</h3>
                    <Table striped hover>
                        <tbody>
                            {awayPlayers.map(player => <PlayerRatingsRow player={player} />)}
                        </tbody>
                    </Table>
                </div>
            </div>
        </PageWrapper>
    );
    
}

function PlayerRatingsRow(props){
    const {player} = props;
    const {ratings} = player;
    const {points, assists, rebounds} = ratings;
    return (
        <tr>
            <td><PlayerLink player={player} /></td>
            <td>{points}</td>
            <td>{assists}</td>            
            <td>{rebounds}</td>            
        </tr>
    )
}