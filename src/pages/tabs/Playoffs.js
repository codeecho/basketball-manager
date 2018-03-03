import React from 'react';

import {Table, Row, Col} from 'react-bootstrap';

import TeamLink from '../../components/TeamLink';

export default function Playoffs(props){
    
    const {playoffs, playoffType, teamId} = props;
    
    const rounds = playoffs.length;
    
    return (
        <Row>
            {playoffs.map(round => <PlayoffRound round={round} playoffType={playoffType} teamId={teamId} />)}
        </Row>
    );
}

function PlayoffRound(props){
    const {round, playoffType, teamId} = props;
    return (
        <Col xs={3} className='playoff-round'>
            {round.map(fixture => <PlayoffFixture fixture={fixture} playoffType={playoffType} teamId={teamId} />)}
        </Col>
    );
}

function PlayoffFixture(props){
    const {fixture, playoffType, teamId} = props;
    const {homeTeam, awayTeam, homeWins, awayWins, winnerId, homeId, awayId, homeScore, awayScore} = fixture;
    return (
        <Table striped condensed className='playoff-fixture'>
            <tbody>
                <tr className={homeId === teamId ? 'info' : winnerId === homeId ? 'success': ''}>
                    <th><TeamLink team={homeTeam} /></th>
                    <td>{homeWins}</td>
                    {playoffType === 'BBL' && <td>{homeScore}</td>}
                </tr>
                <tr className={awayId === teamId ? 'info' : winnerId === awayId ? 'success': ''}>
                    <th><TeamLink team={awayTeam} /></th>
                    <td>{awayWins}</td>
                    {playoffType === 'BBL' && <td>{awayScore}</td>}
                </tr>            
            </tbody>            
        </Table>
    )
}