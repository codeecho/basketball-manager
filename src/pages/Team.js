import React from 'react';

import PageWrapper from '../containers/PageWrapper';

export default function Team(props){
    
    const {team, players} = props;
    
    return (
        <PageWrapper>
            <div>
                <h3>{team.name}</h3>
                <table>
                    <tbody>
                        { players.map(player => <Player {...player}/>) }
                    </tbody>
                </table>
                <a href="#/standings">Standings</a>
            </div>
        </PageWrapper>
    );
    
}

function Player(props){
    const {id, name} = props;
    const playerHref = `#/player/${id}`;
    return (
        <tr>
            <td>
                <a href={playerHref}>{name}</a>
            </td>
        </tr>
    )
}