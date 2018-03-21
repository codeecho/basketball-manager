import React from 'react';

import {Table, Button, Glyphicon} from 'react-bootstrap';

import ordinal from 'ordinal';

export default function DraftPickTable(props){
    
    const {draftPicks} = props;

 
    return (
        <Table striped hover>
            <tbody>
                {draftPicks.map(draftPick => <DraftPickRow draftPick={draftPick} {...props} />)}
            </tbody>            
        </Table>
    );
    
}

function DraftPickRow(props){
    const {draftPick, onSelect, selectIcon = 'arrow-left', selectButtonStyle = "default"} = props;
    const {year, round, acquired, team} = draftPick;
    const roundString = ordinal(round) + " Round Pick";
    return (
        <tr>
            {onSelect && <td><Button onClick={() => onSelect(draftPick)} bsStyle={selectButtonStyle}><Glyphicon glyph={selectIcon} /></Button></td>}        
            <td>{year}</td>
            <td>{roundString}</td>
            <td>{acquired && `from ${team.name}`}</td>
        </tr>
    );
}