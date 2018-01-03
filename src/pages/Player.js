import React from 'react';

import PageWrapper from '../containers/PageWrapper';
import TeamLink from '../components/TeamLink';

export default function Player(props){
    
    const {player, team} = props;
    
    return (
        <PageWrapper>
            <div>
                <h3>{player.name}</h3>
                <p>Team: { team ? <TeamLink team={team}/> : 'Free Agent'}</p>
            </div>
        </PageWrapper>
    );
    
}