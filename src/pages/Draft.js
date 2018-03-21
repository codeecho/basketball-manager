import React from 'react';

import PageWrapper from '../containers/PageWrapper';

import PlayerTable from '../components/PlayerTable';

export default function Draft(props){
    
    const {year, players} = props;
    
    return (
        <PageWrapper title={year + ' Draft'}>
            <div>
                <PlayerTable players={players} defaultSortProperty="potential"/>
            </div>
        </PageWrapper>
    );
    
}


// WEBPACK FOOTER //
// src/pages/Draft.js