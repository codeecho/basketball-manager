import React, {Component} from 'react';

import {Table} from 'react-bootstrap';

import PageWrapper from '../containers/PageWrapper';
import TeamLink from '../components/TeamLink';

export default class TeamsGodMode extends Component{
    
    constructor(props){
        super(props);
        
        this.state = {
            sort: 'overall'
        }
        
        this.sort = this.sort.bind(this);
    }
    
    sort(property){
        this.setState({
            sort: property
        });
    }
    
    render(){
        const {teams} = this.props;
        
        if(!teams) return null;
        
        const sortProperty = this.state.sort;
        
        teams.sort((a, b) => b.ratings[sortProperty] - a.ratings[sortProperty]);
    
        return (
            <PageWrapper title="Teams">
                <Table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Payroll</th>
                            <th onClick={() => this.sort('scoring')}>Scoring</th>
                            <th onClick={() => this.sort('defense')}>Defense</th>
                            <th onClick={() => this.sort('rebounding')}>Rebounding</th>
                            <th onClick={() => this.sort('passing')}>Passing</th>
                            <th onClick={() => this.sort('offensiveRating')}>Offensive Rating</th>
                            <th onClick={() => this.sort('defensiveRating')}>Defensive Rating</th>
                            <th onClick={() => this.sort('overall')}>Overall</th>   
                            <th>Rating</th>
                            <th>Strategy</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teams.map(team => <TeamRow team={team} />)}
                    </tbody>
                </Table>
            </PageWrapper>
        );
    }
    
    
}

function TeamRow(props){
    const {team} = props;
    const {name, payroll, ratings, rating, strategy} = team;
    const {scoring, defense, rebounding, passing, offensiveRating, defensiveRating, overall} = ratings;
    return (
        <tr>
            <th><TeamLink team={team} /></th>
            <td>{payroll}</td>
            <td>{scoring}</td>
            <td>{defense}</td>
            <td>{rebounding}</td>
            <td>{passing}</td>
            <td>{offensiveRating}</td>
            <td>{defensiveRating}</td>
            <td>{overall}</td> 
            <td>{rating}</td>
            <td>{strategy}</td>            
        </tr>
    )
}


// WEBPACK FOOTER //
// src/pages/Home.js