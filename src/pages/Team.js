import React from 'react';

import {Row, Col, Table} from 'react-bootstrap';

import PageWrapper from '../containers/PageWrapper';

import PlayerTable from '../containers/PlayerTable';

export default function Team(props){
    
    const {team, players} = props;
    
    return (
        <PageWrapper>
            <div>
                <h3>{team.name}</h3>
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
                    <PlayerTable players={players} />
                </Row>
            </div>
        </PageWrapper>
    );
    
}