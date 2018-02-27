import React from 'react';

import {Table} from 'react-bootstrap';

export default function TeamGodMode(props){
    const {lineupRatings} = props;
    const {scoring, defense, rebounding, passing, offensiveRating, defensiveRating, overall} = lineupRatings;
    
    return (
        <Table>
            <tbody>
                <tr>
                    <th>Scoring</th>
                    <td>{scoring}</td>
                </tr>
                <tr>
                    <th>Defense</th>
                    <td>{defense}</td>
                </tr>
                <tr>
                    <th>Rebounding</th>
                    <td>{rebounding}</td>
                </tr>
                <tr>
                    <th>Passing</th>
                    <td>{passing}</td>
                </tr>
                <tr>
                    <th>Offensive Rating</th>
                    <td>{offensiveRating}</td>
                </tr>
                <tr>
                    <th>Defensive Rating</th>
                    <td>{defensiveRating}</td>
                </tr>
                <tr>
                    <th>Overall</th>
                    <td>{overall}</td>
                </tr>
            </tbody>
        </Table>
    );
}