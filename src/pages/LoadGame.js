import React, {Component} from 'react';

import {Button, ButtonGroup} from 'react-bootstrap';

import PageWrapper from '../containers/PageWrapper';

import PersistenceService from '../services/PersistenceService';

const persistenceService = new PersistenceService();

export default class LoadGame extends Component{
    
    constructor(props){
        super(props);
        
        const savedGames = persistenceService.getSavedGames();
        
        this.state = {
            savedGames
        };
        
        this.loadGame = this.loadGame.bind(this);
        this.deleteGame = this.deleteGame.bind(this);
    }
    
    loadGame(gameId){
        persistenceService.loadGame(gameId);
        window.location = '/';
    }
    
    deleteGame(gameId){
        persistenceService.deleteGame(gameId);
        this.refreshSavedGames();
    }
    
    refreshSavedGames(){
        const savedGames = persistenceService.getSavedGames();
        
        this.setState({
            savedGames
        });
    }
    
    render(){
       return (
            <PageWrapper title="Load Game">
                <div className="container" style={{marginTop: 20}}>
                    {this.state.savedGames.map(game => {
                        return (
                            <ButtonGroup style={{width: '100%', marginTop: 10}}>
                                <Button style={{width: '70%'}} bsSize="large" bsStyle="primary" onClick={() => this.loadGame(game.id)}>{game.label}</Button>
                                <Button style={{width: '30%'}} bsSize="large" bsStyle="danger" onClick={() => this.deleteGame(game.id)}>Delete</Button>                            
                            </ButtonGroup>                        
                        );
                    })}
                </div>
            </PageWrapper>
        ); 
    }    
    
}