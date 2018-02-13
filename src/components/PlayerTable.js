import React from 'react';

import {Table, Button, Glyphicon} from 'react-bootstrap';

import CheckBox from './CheckBox';

import {GAME_STATE_CONTRACT_NEGOTIATIONS} from '../constants';

export default function PlayerTable(props){
    const {players, onSelect, year, stage} = props;
    return (
        <div className="scrolling-table">
            <div className="scrolling-table-inner">
                <Table striped hover>
                    <thead>
                        <tr>
                            {onSelect && <th></th>}
                            <th>Name</th>
                            <th>Position</th>                            
                            <th>Age</th>
                            <th>Ability</th>
                            <th>Potential</th>
                            <th>Contract</th>
                        </tr>
                    </thead>
                    <tbody>
                        { players.map(player => <PlayerRow player={player} {...props} />) }
                    </tbody>
                </Table>
            </div>
        </div>
    )
}

function PlayerRow(props){
    const {player, onSelect, selectIcon = 'arrow-left', selectButtonStyle = "default", year, stage} = props;
    const {id, name, age, ability, delta, potential, salary, contractExpiry, teamId, expectedSalary, position} = player;
    const isContractExpiring = stage === GAME_STATE_CONTRACT_NEGOTIATIONS && contractExpiry === year;
    const deltaString = delta > 0 ? '+' + delta : ''+delta;
    const playerHref = `#/player/${id}`;
    const classes = isContractExpiring ? 'info' : '';
    return (
        <tr className={classes}>       
            {onSelect && <td><Button onClick={() => onSelect(player)} bsStyle={selectButtonStyle}><Glyphicon glyph={selectIcon} /></Button></td>}
            <td>
                <a href={playerHref} className="nowrap">{name}</a>
            </td>
            <td>{position}</td>
            <td>{age}</td>
            <td>{ability} ({deltaString})</td>
            <td>{potential}</td>
            {teamId && !isContractExpiring && <td><span className="nowrap">${salary}M until {contractExpiry}</span></td>}
            {teamId && isContractExpiring && <td><span className="nowrap">expects ${expectedSalary}M for 3 years</span></td>}            
            {!teamId && <td><span className="nowrap">expects ${expectedSalary}M for 3 years</span></td>}
        </tr>
    )
}