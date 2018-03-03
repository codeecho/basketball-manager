import React from 'react';

import {Table, Row, Col} from 'react-bootstrap';

import TeamLink from '../../components/TeamLink';

export default function Playoffs(props){
    
    const {playoffs} = props;
    
    const rounds = playoffs.length;
    
    return (
        <Row>
            {playoffs.map(round => <PlayoffRound round={round} />)}
        </Row>
    );
}

function PlayoffRound(props){
    const {round} = props;
    return (
        <Col xs={3} className='playoff-round'>
            {round.map(fixture => <PlayoffFixture fixture={fixture} />)}
        </Col>
    );
}

function PlayoffFixture(props){
    const {fixture} = props;
    const {homeTeam, awayTeam, homeWins, awayWins, winnerId, homeId, awayId} = fixture;
    return (
        <Table striped condensed className='playoff-fixture'>
            <tbody>
                <tr className={winnerId === homeId ? 'success': ''}><th><TeamLink team={homeTeam} /></th><td>{homeWins}</td></tr>
                <tr className={winnerId === awayId ? 'success': ''}><th><TeamLink team={awayTeam} /></th><td>{awayWins}</td></tr>            
            </tbody>            
        </Table>
    )
}