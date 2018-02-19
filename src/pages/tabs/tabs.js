export const FIXTURES_TAB_ID = 'fixtures';

export function getTeamTabs(team){
    return [
        { id: undefined, label: 'Lineup', target: `/#/team/${team.id}`},
        { id: FIXTURES_TAB_ID, label: 'Fixtures', target: `/#/team/${team.id}/fixtures`}
    ];
}

export const TRADING_BLOCK_TAB_ID = 'tradingBlock';
export const TRADE_TAB_ID = 'trade';

export const tradeTabs = [
    //{id: TRADING_BLOCK_TAB_ID, label: 'Request Proposals', target: '/#/tradingBlock'},
    {id: TRADE_TAB_ID, label: 'Make a Trade', target: '/#/trade'}
];