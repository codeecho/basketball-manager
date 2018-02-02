import React, {Component} from 'react';

import {Button, ButtonGroup} from 'react-bootstrap';

import PageWrapper from '../containers/PageWrapper';
import TeamLink from '../components/TeamLink';

import confirm from '../utils/confirm';

export default class Player extends Component{

    constructor(props){
        super(props);
        
        this.signFreeAgent = this.signFreeAgent.bind(this);
        this.extendContract = this.extendContract.bind(this);
        this.releasePlayer = this.releasePlayer.bind(this);
    }

    signFreeAgent(){
        const {player, signFreeAgent} = this.props;
        
        const {name, expectedSalary} = player;
        
        confirm.show({
            text: `You are about to sign ${name} for $${expectedSalary}M over the next 3 years`,
            onConfirm: signFreeAgent
        })
    }
    
    extendContract(){
        const {player, extendContract} = this.props;
        
        const {name, expectedSalary} = player;
        
        confirm.show({
            text: `You are about to extend ${name}'s contract for $${expectedSalary}M over the next 3 years`,
            onConfirm: extendContract
        })
    }
    
    releasePlayer(){
        const {player, releasePlayer} = this.props;
        
        const {name} = player;
        
        confirm.show({
            text: `You are about to release ${name}`,
            onConfirm: releasePlayer
        })
    }
    
    render(){
    
        const {isContractExpiring, player, team, signFreeAgent, extendContract} = this.props;
        
        const {name, age, ability, salary, contractExpiry, expectedSalary} = player;    
        
        return (
            <PageWrapper>
                <div>
                    <h3>{player.name}</h3>
                    <p>Age: {age}</p>
                    <p>Ability: {ability}</p>
                    {team && <p>Contract: ${salary}M until {contractExpiry}</p>}
                    {!team && <p>Contract: expects ${expectedSalary}M over 3 years</p>}                
                    <p>Team: { team ? <TeamLink team={team}/> : 'Free Agent'}</p>
                    {!team && <Button onClick={this.signFreeAgent}>Sign as Free Agent</Button>}
                    {isContractExpiring && 
                        <ButtonGroup>
                            <Button bsStyle="danger" onClick={this.releasePlayer}>Release</Button>
                            <Button onClick={this.extendContract}>Extend Contract</Button>
                        </ButtonGroup>
                    }                
                </div>
            </PageWrapper>
        );
    
    }
    
}