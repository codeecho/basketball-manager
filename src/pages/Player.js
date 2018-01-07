import React from 'react';

import {Button} from 'react-bootstrap';

import PageWrapper from '../containers/PageWrapper';
import TeamLink from '../components/TeamLink';

export default function Player(props){
    
    const {isContractExpiring, player, team, signFreeAgent, extendContract} = props;
    
    const {name, ability, salary, contractExpiry} = player;    
    
    return (
        <PageWrapper>
            <div>
                <h3>{player.name}</h3>
                <p>Ability: {ability}</p>
                {team && <p>Contract: ${salary}M until {contractExpiry}</p>}
                {!team && <p>Contract: ${salary}M expired</p>}                
                <p>Team: { team ? <TeamLink team={team}/> : 'Free Agent'}</p>
                {!team && <Button onClick={signFreeAgent}>Sign as Free Agent</Button>}
                {isContractExpiring && <Button onClick={extendContract}>Extend Contract</Button>}                
            </div>
        </PageWrapper>
    );
    
}