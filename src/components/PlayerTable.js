import React from 'react';

import {Table, Button, Glyphicon} from 'react-bootstrap';

import SortableTable from './SortableTable';
import CheckBox from './CheckBox';

import {GAME_STATE_CONTRACT_NEGOTIATIONS} from '../constants';

export default function PlayerTable(props){
    const {players, onSelect, year, stage, defaultSortProperty = 'ability'} = props;
    let headings = onSelect ? [{label: ''}] : []
    headings = headings.concat([
        {label: 'Name'},
        {label: 'Position'},
        {label: 'Age'},        
        {label: 'Scoring', property: 'scoring'},
        {label: 'Defense', property: 'defense'},
        {label: 'Rebounding', property: 'rebounding'},
        {label: 'Passing', property: 'passing'},
        {label: 'Overall', property: 'ability'},
        {label: 'Potential', property: 'potential'},
        {label: 'Contract'}
    ]);
    return (
        <div className="scrolling-table">
            <div className="scrolling-table-inner">
                <SortableTable limit={props.limit} defaultSortProperty={defaultSortProperty} data={players} headings={headings} renderRow={(player => <PlayerRow player={player} {...props} />)} />
            </div>
        </div>
    )
}

function PlayerRow(props){
    const {player, onSelect, selectIcon = 'arrow-left', selectButtonStyle = "default", year, stage} = props;
    const {id, name, age, ability, delta, potential, salary, contractExpiry, teamId, expectedSalary, position, scoring, defense, rebounding, passing} = player;
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
            <td>{scoring}</td>
            <td>{defense}</td>
            <td>{rebounding}</td>
            <td>{passing}</td>            
            <td>{ability} ({deltaString})</td>
            <td>{potential}</td>
            {teamId && !isContractExpiring && <td><span className="nowrap">${salary}M until {contractExpiry}</span></td>}
            {teamId && isContractExpiring && <td><span className="nowrap">expects ${expectedSalary}M for 3 years</span></td>}            
            {!teamId && <td><span className="nowrap">expects ${expectedSalary}M for 3 years</span></td>}
        </tr>
    )
}