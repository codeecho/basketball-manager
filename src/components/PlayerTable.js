import React from 'react';

import {Table} from 'react-bootstrap';

export default function PlayerTable(props){
    const {year, players} = props;
    return (
        <Table striped hover>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Ability</th>
                    <th>Contract</th>                    
                </tr>
            </thead>
            <tbody>
                { players.map(player => <PlayerRow year={year} {...player}/>) }
            </tbody>
        </Table>
    )
}

function PlayerRow(props){
    const {id, name, dob, ability, salary, contractExpiry, teamId, year} = props;
    const playerHref = `#/player/${id}`;
    return (
        <tr>
            <td>
                <a href={playerHref}>{name}</a>
            </td>
            <td>{year - dob}</td>
            <td>{ability}</td>
            {teamId && <td>${salary}M until {contractExpiry}</td>}
            {!teamId && <td>${salary}M expired</td>}            
        </tr>
    )
}