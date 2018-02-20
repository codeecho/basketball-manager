import React from 'react';

import PageWrapper from '../containers/PageWrapper';

import TeamFixtures from './tabs/TeamFixtures';
import Lineup from './tabs/Lineup';

import {FIXTURES_TAB_ID, getTeamTabs} from './tabs/tabs';

export default function Team(props){
    
    const {tab, team} = props;
    
    const tabs = getTeamTabs(team);
    
    return (
        <PageWrapper title={team.name} tabs={tabs} selectedTab={tab}>
            {tab === FIXTURES_TAB_ID ? 
                <TeamFixtures {...props} /> 
            :
                <Lineup {...props} />
            }
        </PageWrapper>
    );
    
}


// WEBPACK FOOTER //
// src/pages/Team.js