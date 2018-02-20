import React from 'react';

import {Row, Col, Table} from 'react-bootstrap';

import PlayerTable from '../../containers/PlayerTable';

export default function Lineup(props){
    
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
                    <PlayerTable players={starters} />
                </div>
                <div>
                    <h3>Second Unit</h3>
                    <PlayerTable players={secondUnit} />
                </div>
                <div>
                    <h3>Reserves</h3>
                    <PlayerTable players={reserves} />
                </div>
            </Row>
        </div>
    );
    
}


// WEBPACK FOOTER //
// src/pages/tabs/Lineup.js