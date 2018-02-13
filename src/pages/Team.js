import React from 'react';

import {Row, Col, Table} from 'react-bootstrap';

import PageWrapper from '../containers/PageWrapper';

import PlayerTable from '../containers/PlayerTable';

export default function Team(props){
    
    const {team, players, starters, secondUnit, reserves} = props;
    
    return (
        <PageWrapper>
            <div>
                <h2>{team.name}</h2>
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
                    <h3>Starters</h3>
                    <PlayerTable players={starters} />
                    <h3>Second Unit</h3>
                    <PlayerTable players={secondUnit} />
                    <h3>Reserves</h3>
                    <PlayerTable players={reserves} />
                </Row>
            </div>
        </PageWrapper>
    );
    
}