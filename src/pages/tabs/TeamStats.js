import React from 'react';

import {Table, Row, Col} from 'react-bootstrap';

import PlayerStatsTable from '../../components/PlayerStatsTable';

export default function TeamStats(props){
    
    const {team, players, starters, secondUnit, reserves} = props;
    
    return (
        <div>
            <Row>
                <Col md={6}>
                    <Table condensed>
                        <tbody>
                            <tr>
                                <th>Payroll</th>
                                <td>${team.payroll}M</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row>
                <div>
                    <h3>Starters</h3>
                    <PlayerStatsTable players={starters} />
                </div>
                <div>
                    <h3>Second Unit</h3>
                    <PlayerStatsTable players={secondUnit} />
                </div>
                <div>
                    <h3>Reserves</h3>
                    <PlayerStatsTable players={reserves} />
                </div>
            </Row>
        </div>
    );
    
}