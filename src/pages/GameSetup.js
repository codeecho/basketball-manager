import React, {Component} from 'react';

import { Button, Table, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

import PageWrapper from '../containers/PageWrapper';

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
        return (
            <PageWrapper>
                <div className="container" style={{marginTop: 20}}>
                    <Button block bsSize="large" bsStyle="primary" onClick={props.loadDemoData}>Load Demo Data</Button>
                </div>
            </PageWrapper>
        );
        }else{
            return (
                <PageWrapper>
                    <div className="container" style={{marginTop: 20}}>
                        <FormGroup>
                            <ControlLabel>Name: </ControlLabel>
                            <FormControl type="text" placeholder="Enter your name" onChange={this.setUsername}></FormControl>
                        </FormGroup>                    
                        <br/>
                        <Table>
                            <tbody>
                                {props.teams.map(team => <TeamSelect team={team} setTeam={this.setTeam} />)}
                            </tbody>
                        </Table>
                    </div>
                </PageWrapper>                
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
                <Button bsSize="large" bsStyle="primary" onClick={() => props.setTeam(team)}>Manage</Button>
            </td>
        </tr>
    )
}