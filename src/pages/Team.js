import React from 'react';

import PageWrapper from '../containers/PageWrapper';

import PlayerTable from '../components/PlayerTable';

export default function Team(props){
    
    const {team, players, year} = props;
    
    return (
        <PageWrapper>
            <div>
                <h3>{team.name}</h3>
                <PlayerTable players={players} year={year} />
            </div>
        </PageWrapper>
    );
    
}