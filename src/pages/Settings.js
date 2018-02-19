import React, {Component} from 'react';

import {Button} from 'react-bootstrap';

import PageWrapper from '../containers/PageWrapper';

export default class Player extends Component{

    constructor(props){
        super(props);
    }
    
    render(){
        
        return (
            <PageWrapper title="Settings">
                <div>
                    <Button bsSize="large" bsStyle="primary" block onClick={this.props.newGame}>Start New Game</Button>              
                    <Button bsSize="large" bsStyle="primary" block onClick={this.props.hostOnlineGame}>Host Online Game</Button>
                    <Button bsSize="large" bsStyle="primary" block onClick={this.props.joinOnlineGame}>Join Online Game</Button>                    
                </div>
            </PageWrapper>
        );
    
    }
    
}