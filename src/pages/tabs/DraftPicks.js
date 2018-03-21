import React from 'react';

import DraftPickTable from '../../containers/DraftPickTable';

export default function DraftPicks(props){
    
    const {draftPicks} = props;

 
    return (
        <DraftPickTable draftPicks={draftPicks} />
    );
    
}