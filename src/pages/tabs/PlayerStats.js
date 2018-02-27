import React from 'react';

import {Table} from 'react-bootstrap';

export default function PlayerStats(props){
    
    const {playerRatingHistory} = props;
    
    return (
        <Table striped>
            <thead>
                <tr>
                    <td>Opponent</td>                
                    <td>Points</td>
                    <td>Assists</td>
                    <td>Rebounds</td>                    
                </tr>
            </thead>
            <tbody>
                {playerRatingHistory.map(ratings => <PlayerRatingsRow ratings={ratings} />)}
            </tbody>
        </Table>
    );
}

function PlayerRatingsRow(props){
    const {ratings} = props;
    const {points, assists, rebounds, opponent} = ratings;
    return (
        <tr>
            <td>{opponent.name}</td>
            <td>{points}</td>
            <td>{assists}</td>            
            <td>{rebounds}</td>            
        </tr>
    )
}