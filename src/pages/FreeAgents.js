import React from 'react';

import PageWrapper from '../containers/PageWrapper';

import PlayerTable from '../components/PlayerTable';

export default function FreeAgents(props){
    
    const {players} = props;
    
    return (
        <PageWrapper>
            <div>
                <PlayerTable players={players} />
            </div>
        </PageWrapper>
    );
    
}