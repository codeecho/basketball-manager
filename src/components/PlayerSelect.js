import React from 'react';

import PlayerTable from './PlayerTable';

export default function PlayerSelect(props){
    
    const {players, selectPlayer, closeModal} = props;
    
    const onSelect = (player) => {
        selectPlayer(player);
        if(closeModal) closeModal();
    }
    
    return <PlayerTable players={players} onSelect={onSelect} selectButtonStyle="success" selectIcon="plus" />
    
}


// WEBPACK FOOTER //
// src/components/PlayerSelect.js