import React from 'react';

import { Table } from 'react-bootstrap';

import PageWrapper from '../containers/PageWrapper';
import TeamLink from '../components/TeamLink';
import PlayerStatsTable from '../components/PlayerStatsTable';
import PlayerTable from '../containers/PlayerTable';

import {standingsTabs, STATS_TAB_ID, RATINGS_TAB_ID} from './tabs/tabs';

export default function Home(props){
    
    const {tab, standings, teamId, otherUserTeamIds, players, playerRatings} = props;
    
    function getActiveTab(){
        if(tab === STATS_TAB_ID){
            return <PlayerStatsTable players={playerRatings} highlightTeam={teamId}/>;
        }else if(tab === RATINGS_TAB_ID){
            return <PlayerTable players={players} highlightTeam={teamId} limit={50}/>;
        }else{
            return (
                <div>
                    <Table striped hover>
                        <thead>
                            <tr>                           
                                <th></th>
                                <th>P</th>
                                <th>W</th>
                                <th>L</th>
                            </tr>
                        </thead>
                        <tbody>
                            { standings.map((standing, i) => <Standing index={i+1} {...standing} teamId={teamId} otherUserTeamIds={otherUserTeamIds} key={standing.teamId} />) }
                        </tbody>
                    </Table>
                </div>
            );
        }
    }
    
    return (
        <PageWrapper title="Standings" tabs={standingsTabs} selectedTab={tab}>
            {getActiveTab()}
        </PageWrapper>
    );
    
}

function Standing(props){
    const {index, team, played, won, lost, teamId, otherUserTeamIds} = props;
    const teamHref = `#/team/${team.id}`;
    const isUserTeam = team.id === teamId;
    const isOtherUserTeam = otherUserTeamIds.includes(team.id);
    const classes = isUserTeam ? 'info' : isOtherUserTeam ? 'warning' : undefined;
    return (
        <tr className={classes}>
            <td>
                {index}. <TeamLink team={team} />
            </td>
            <td>{played}</td>
            <td>{won}</td>
            <td>{lost}</td>
        </tr>
    )
}


// WEBPACK FOOTER //
// src/pages/Standings.js