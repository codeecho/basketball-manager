import React from 'react';

import PageWrapper from '../containers/PageWrapper';

import Lineup from './tabs/Lineup';
import TeamFixtures from './tabs/TeamFixtures';
import TeamStats from './tabs/TeamStats';
import DraftPicks from '../containers/DraftPicks';

import TeamGodMode from './tabs/TeamGodMode';

import {FIXTURES_TAB_ID, STATS_TAB_ID, DRAFT_PICKS_TAB_ID, GOD_MODE_TAB_ID, getTeamTabs} from './tabs/tabs';

export default function Team(props){
    
    const {tab, team} = props;
    
    const tabs = getTeamTabs(team);

    function getActiveTab(){
        if(tab === FIXTURES_TAB_ID){
            return <TeamFixtures {...props} />;
        }else if(tab === STATS_TAB_ID){
            return <TeamStats {...props} />;
        }else if(tab === DRAFT_PICKS_TAB_ID){
            return <DraftPicks {...props} />
        }else if(tab === GOD_MODE_TAB_ID){
            return <TeamGodMode {...props} />            
        }else{
            return <Lineup {...props} />
        }
    }
    
    return (
        <PageWrapper title={team.name} tabs={tabs} selectedTab={tab}>
            {getActiveTab()}
        </PageWrapper>
    );
    
}


// WEBPACK FOOTER //
// src/pages/Team.js