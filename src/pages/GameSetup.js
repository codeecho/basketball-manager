import React from 'react';

import Standings from '../containers/Standings';

export default function Home(props){

    if(!props.teams){
        return <button onClick={props.loadDemoData}/>
    }else{
        return (
            <table>
                <tbody>
                    {props.teams.map(team => <TeamSelect team={team} setTeam={props.setTeam} />)}
                </tbody>
            </table>
        );
    }
    
}

function TeamSelect(props){
    const {team} = props;
    return (
        <tr>
            <td>{team.name}</td>
            <td>
                <button onClick={() => props.setTeam(team.id)}>Manage</button>
            </td>
        </tr>
    )
}