import React from 'react';

import PageWrapper from '../containers/PageWrapper';
import TeamLink from '../components/TeamLink';

export default function Home(props){
    
    const {standings} = props;
    
    return (
        <PageWrapper>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>P</th>
                        <th>W</th>
                        <th>L</th>
                    </tr>
                </thead>
                <tbody>
                    { standings.map(standing => <Standing {...standing} key={standing.teamId} />) }
                </tbody>
            </table>
        </PageWrapper>
    );
    
}

function Standing(props){
    const { team, played, won, lost} = props;
    const teamHref = `#/team/${team.id}`;
    return (
        <tr>
            <td>
                <TeamLink team={team} />
            </td>
            <td>{played}</td>
            <td>{won}</td>
            <td>{lost}</td>
        </tr>
    )
}