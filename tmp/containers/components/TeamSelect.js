import React from 'react';

import {FormControl} from 'react-bootstrap';

export default function TeamSelect(props){

    const {teams, onSelect} = props;
    
    return (
        <FormControl className="team-select" componentClass="select" placeholder="Select Team" onChange={e => onSelect(e.target.value*1)}>
            {teams.map(team => <option value={team.id} selected={team.id === props.selectedTeamId}>{team.name}</option>)}
		</FormControl>
    )
    
}


// WEBPACK FOOTER //
// src/components/TeamSelect.js