import React, {Component} from 'react';

import Standings from '../containers/Standings';

export default class GameSetup extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            username: ''
        }
        
        this.setUsername = this.setUsername.bind(this);
        this.setTeam = this.setTeam.bind(this);
    }
    
    setUsername(e){
        this.setState({
            username: e.target.value
        });
    }
    
    setTeam(team){
        this.props.setTeam(team.id, this.state.username);
    }
    
    render(){
        const props = this.props;
        if(!props.teams){
            return <button onClick={props.loadDemoData}>Load Demo Data</button>
        }else{
            return (
                <div>
                    Name: <input type="text" onChange={this.setUsername}/>
                    <br/>
                    <table>
                        <tbody>
                            {props.teams.map(team => <TeamSelect team={team} setTeam={this.setTeam} />)}
                        </tbody>
                    </table>
                </div>
            );
        }
    }
    
}

function TeamSelect(props){
    const {team} = props;
    return (
        <tr>
            <td>{team.name}</td>
            <td>
                <button onClick={() => props.setTeam(team)}>Manage</button>
            </td>
        </tr>
    )
}