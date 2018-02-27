export const GOD_MODE_TAB_ID = 'god';

export const FIXTURES_TAB_ID = 'fixtures';
export const STATS_TAB_ID = 'stats';

export function getTeamTabs(team){
    return [
        { id: undefined, label: 'Ratings', target: `/#/team/${team.id}`},
        { id: STATS_TAB_ID, label: 'Stats', target: `/#/team/${team.id}/${STATS_TAB_ID}`},
                { id: FIXTURES_TAB_ID, label: 'Fixtures', target: `/#/team/${team.id}/fixtures`}
    ];
}

export function getPlayerTabs(player){
    return [
        { id: undefined, label: 'Profile', target: `/#/player/${player.id}`},
        { id: STATS_TAB_ID, label: 'Stats', target: `/#/player/${player.id}/${STATS_TAB_ID}`}
    ];
}

export const RATINGS_TAB_ID = 'ratings';

export const standingsTabs = [
    { id: undefined, label: 'Standings', target: `/#/standings`},
    { id: STATS_TAB_ID, label: 'Player Stats', target: `/#/standings/${STATS_TAB_ID}`},
    { id: RATINGS_TAB_ID, label: 'Player Ratings', target: `/#/standings/${RATINGS_TAB_ID}`}    
];

export const TRADING_BLOCK_TAB_ID = 'tradingBlock';
export const TRADE_TAB_ID = 'trade';

export const tradeTabs = [
    //{id: TRADING_BLOCK_TAB_ID, label: 'Request Proposals', target: '/#/tradingBlock'},
    {id: TRADE_TAB_ID, label: 'Make a Trade', target: '/#/trade'}
];


// WEBPACK FOOTER //
// src/pages/tabs/tabs.js