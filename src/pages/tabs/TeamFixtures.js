import React from 'react';

import {Table, Button} from 'react-bootstrap';

export default function TeamFixtures(props){
    
    const {fixtures, team} = props;
    
    return (
        <Table striped className="text-center">
            <tbody>
                {fixtures.map((fixture, i) => <Fixture fixture={fixture} index={i} team={team}/>)}
            </tbody>
        </Table>
    );
    
}

function Fixture(props){
    const {fixture, index, team} = props;
    const {winnerId, homeScore, awayScore} = fixture;
    const winOrLose = !winnerId ? undefined : winnerId === team.id ? 'W' : 'L'
    const className = !winnerId ? '' : winnerId === team.id ? 'success' : 'danger'    
    const score = !winnerId ? '' : `${awayScore} - ${homeScore}`;
    const fixtureHref = `#/fixture/${index}/${fixture.id}`;
    return (
        <tr className={className}>
            <td>{winOrLose}</td>
            <td>{fixture.awayTeam.name}</td>
            <td> at </td>
            <td>{fixture.homeTeam.name}</td>
            <td>{winOrLose && <a href={fixtureHref}>{score}</a>}</td>
        </tr>
    );
}


// WEBPACK FOOTER //
// src/pages/tabs/TeamFixtures.js