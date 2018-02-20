import React, {Component} from 'react';

import { Button, Table, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

import PageWrapper from '../containers/PageWrapper';

import Standings from '../containers/Standings';

import {NO_TEAM_TEAM_ID} from '../constants';

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
        this.props.setTeam(team ? team.id : NO_TEAM_TEAM_ID, this.state.username);
    }
    
    render(){
        const props = this.props;
        if(!props.teams){
        return (
            <PageWrapper>
                <div className="container" style={{marginTop: 20}}>
                    <Button block bsSize="large" bsStyle="primary" onClick={props.loadTestData}>Load Test Data</Button>                
                    <Button block bsSize="large" bsStyle="primary" onClick={props.loadBBLData}>Load BBL Data</Button>
                    <Button block bsSize="large" bsStyle="primary" onClick={props.loadDemoData}>Load NBA Data</Button>
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
                                <tr className="button-row">
                                    <td>NO TEAM</td>
                                    <td>
                                        <Button bsStyle="primary" onClick={() => this.setTeam(null)}>Spectate</Button>
                                    </td>
                                </tr>
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
        <tr className="button-row">
            <td>{team.name}</td>
            <td>
                <Button bsStyle="primary" onClick={() => props.setTeam(team)}>Manage</Button>
            </td>
        </tr>
    )
}


// WEBPACK FOOTER //
// src/pages/GameSetup.js