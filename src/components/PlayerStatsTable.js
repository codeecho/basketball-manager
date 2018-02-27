import React, {Component} from 'react';

import {Table, Glyphicon} from 'react-bootstrap';

import SortableTable from './SortableTable';
import PlayerLink from './PlayerLink';

export default class PlayerStatsTable extends Component{
    
    constructor(props){
        super(props);
        
        this.sort = this.sort.bind(this);
        this.renderRow = this.renderRow.bind(this);
    }
    
    sort(players, sortProperty, sortDirection){
        players.sort((a, b) => {
            return (b.ratings[sortProperty] - a.ratings[sortProperty]) * sortDirection;
        });
    }
    
    renderRow(player){
        return <PlayerStatsRow player={player} highlightTeam={this.props.highlightTeam} />;
    }
    
    render(){
        const {players} = this.props;
        
        const headings = [
            {label: 'Name'},
            {label: 'Position'},            
            {label: 'Games', property: 'games'},            
            {label: 'PPG', property: 'ppg'},
            {label: 'APG', property: 'apg'},
            {label: 'RPB', property: 'rpg'}
        ]
        
        return <SortableTable defaultSortProperty='ppg' headings={headings} data={players} renderRow={this.renderRow} sort={this.sort} />
    }
    
}

function PlayerStatsRow(props){
    const {player, highlightTeam} = props;
    const {teamId, name, position, ratings} = player;
    const {games, ppg, apg, rpg} = ratings;
    const highlight = teamId === highlightTeam;
    const classes = highlight ? 'info' : undefined;
    return (
        <tr className={classes}>
            <td><PlayerLink player={player} /></td>
            <td>{position}</td>            
            <td>{games}</td>
            <td>{ppg}</td>
            <td>{apg}</td>
            <td>{rpg}</td>
        </tr>        
    );
}