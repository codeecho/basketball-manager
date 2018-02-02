import React from 'react';

import { Table } from 'react-bootstrap';

import PageWrapper from '../containers/PageWrapper';
import TeamLink from '../components/TeamLink';

export default function Home(props){
    
    const {standings, teamId} = props;
    
    return (
        <PageWrapper>
            <Table striped hover>
                <thead>
                    <tr>
                        <th></th>
                        <th>P</th>
                        <th>W</th>
                        <th>L</th>
                    </tr>
                </thead>
                <tbody>
                    { standings.map(standing => <Standing {...standing} highlight={standing.teamId === teamId} key={standing.teamId} />) }
                </tbody>
            </Table>
        </PageWrapper>
    );
    
}

function Standing(props){
    const { team, played, won, lost, highlight} = props;
    const teamHref = `#/team/${team.id}`;
    const classes = highlight ? 'success' : undefined;
    return (
        <tr className={classes}>
            <td>
                <TeamLink team={team} />
            </td>
            <td>{played}</td>
            <td>{won}</td>
            <td>{lost}</td>
        </tr>
    )
}