import React from 'react';

import DraftPickTable from '../containers/DraftPickTable';

export default function PlayerSelect(props){
    
    const {draftPicks, onSelect, closeModal} = props;
    
    const selectPick = (pick) => {
        onSelect(pick);
        if(closeModal) closeModal();
    }
    
    return <DraftPickTable draftPicks={draftPicks} onSelect={selectPick} selectButtonStyle="success" selectIcon="plus" />
    
}