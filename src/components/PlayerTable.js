import React from 'react';

import {Table} from 'react-bootstrap';

export default function PlayerTable(props){
    const {players} = props;
    return (
        <Table striped hover>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Ability</th>
                    <th>Potential</th>
                    <th>Contract</th>                    
                </tr>
            </thead>
            <tbody>
                { players.map(player => <PlayerRow {...player}/>) }
            </tbody>
        </Table>
    )
}

function PlayerRow(props){
    const {id, name, age, ability, delta, potential, salary, contractExpiry, teamId} = props;
    const deltaString = delta > 0 ? '+' + delta : ''+delta;
    const playerHref = `#/player/${id}`;
    return (
        <tr>
            <td>
                <a href={playerHref}>{name}</a>
            </td>
            <td>{age}</td>
            <td>{ability} ({deltaString})</td>
            <td>{potential}</td>
            {teamId && <td>${salary}M until {contractExpiry}</td>}
            {!teamId && <td>${salary}M expired</td>}            
        </tr>
    )
}