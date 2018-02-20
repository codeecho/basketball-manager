import React from 'react';

import {Table} from 'react-bootstrap';

export default function TeamFixtures(props){
    
    const {fixtures, team} = props;
    
    return (
        <Table striped className="text-center">
            <tbody>
                {fixtures.map(fixture => <Fixture fixture={fixture} team={team}/>)}
            </tbody>
        </Table>
    );
    
}

function Fixture(props){
    const {fixture, team} = props;
    const {winnerId, homeScore, awayScore} = fixture;
    const winOrLose = !winnerId ? '' : winnerId === team.id ? 'W' : 'L'
    const className = !winnerId ? '' : winnerId === team.id ? 'success' : 'danger'    
    const score = !winnerId ? '' : `${awayScore} - ${homeScore}`;
    return (
        <tr className={className}>
            <td>{winOrLose}</td>
            <td>{fixture.awayTeam.name}</td>
            <td> at </td>
            <td>{fixture.homeTeam.name}</td>
            <td>{score}</td>
        </tr>
    );
}


// WEBPACK FOOTER //
// src/pages/tabs/TeamFixtures.js