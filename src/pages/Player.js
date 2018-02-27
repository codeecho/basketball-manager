import React, {Component} from 'react';

import {Button, ButtonGroup, Table, Col} from 'react-bootstrap';

import PageWrapper from '../containers/PageWrapper';

import PlayerProfile from './tabs/PlayerProfile';
import PlayerStats from './tabs/PlayerStats';

import {getPlayerTabs, STATS_TAB_ID} from './tabs/tabs';

export default class Player extends Component{

    constructor(props){
        super(props);
        
        this.getActiveTab = this.getActiveTab.bind(this);
    }
    
    getActiveTab(){
        const {tab} = this.props;
        if(tab === STATS_TAB_ID){
            return <PlayerStats {...this.props} />
        }else{
            return <PlayerProfile {...this.props} />
        }
    }
    
    render(){
    
        const {tab, player} = this.props;
        
        const tabs = getPlayerTabs(player);
        
        return (
            <PageWrapper title={player.name} tabs={tabs} selectedTab={tab}>
                {this.getActiveTab()}
            </PageWrapper>
        );
    
    }
    
}