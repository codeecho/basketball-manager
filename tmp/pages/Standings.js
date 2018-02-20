import React from 'react';

import { Table } from 'react-bootstrap';

import PageWrapper from '../containers/PageWrapper';
import TeamLink from '../components/TeamLink';

export default function Home(props){
    
    const {standings, teamId, otherUserTeamIds} = props;
    
    return (
        <PageWrapper title="Standings">
            <div>
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
                        { standings.map(standing => <Standing {...standing} teamId={teamId} otherUserTeamIds={otherUserTeamIds} key={standing.teamId} />) }
                    </tbody>
                </Table>
            </div>
        </PageWrapper>
    );
    
}

function Standing(props){
    const { team, played, won, lost, teamId, otherUserTeamIds} = props;
    const teamHref = `#/team/${team.id}`;
    const isUserTeam = team.id === teamId;
    const isOtherUserTeam = otherUserTeamIds.includes(team.id);
    const classes = isUserTeam ? 'info' : isOtherUserTeam ? 'warning' : undefined;
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


// WEBPACK FOOTER //
// src/pages/Standings.js