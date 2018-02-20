import React, {Component} from 'react';

import {Row, Col, Button, Table} from 'react-bootstrap';

import PageWrapper from '../containers/PageWrapper';

import PlayerTable from '../components/PlayerTable';
import TeamSelect from '../components/TeamSelect';
import PlayerSelect from '../components/PlayerSelect';

import TradeService from '../services/TradeService';

import {TRADING_BLOCK_TAB_ID, tradeTabs} from './tabs/tabs';

import modal from '../utils/modal';

export default class TradingBlock extends Component{
    
    constructor(props){
        super(props);
        
        this.state = {
            unselectedPlayers: props.userPlayers,
            selectedPlayers: [],
            proposals: []
        }
        
        this.tradeService = new TradeService();
        
        this.getTradeProposals = this.getTradeProposals.bind(this);
        this.selectPlayer = this.selectPlayer.bind(this);
        this.deselectPlayer = this.deselectPlayer.bind(this);
        this.showPlayerSelectModal = this.showPlayerSelectModal.bind(this);
    }
    
    selectPlayer(selectedPlayer){
        const unselectedPlayers = this.state.unselectedPlayers.filter(player => player !== selectedPlayer);
        const selectedPlayers = this.state.selectedPlayers.concat(selectedPlayer);
        this.setState({
            unselectedPlayers,
            selectedPlayers,
            proposals: []
        })
    }
    
    deselectPlayer(selectedPlayer){
        const selectedPlayers = this.state.selectedPlayers.filter(player => player !== selectedPlayer);
        const unselectedPlayers = this.state.unselectedPlayers.concat(selectedPlayer);
        this.setState({
            unselectedPlayers,
            selectedPlayers,
            proposals: []
        })
    }
    
    showPlayerSelectModal(){
        modal.show({
            body: <PlayerSelect players={this.state.unselectedPlayers} selectPlayer={this.selectPlayer} />
        });
    }
    
    getTradeProposals(){
        const {teams, players} = this.props;
        const requested = { players: this.state.selectedPlayers };
        const proposals = this.tradeService.getTradeProposals(teams, players, requested);
        this.setState({ proposals });
    }
    
    render(){
        const {userPlayers, teams} = this.props;
    
        return (
            <PageWrapper title="Trading Block" tabs={tradeTabs} selectedTab={TRADING_BLOCK_TAB_ID}>
                <Row>
                    <Col xs={12}>
                        <PlayerTable players={this.state.selectedPlayers} onSelect={this.deselectPlayer} selectButtonStyle="danger" selectIcon="minus"/>
                        <Button bsSize="large" bsStyle="info" block onClick={this.showPlayerSelectModal}>Add Player</Button>
                        <TradeProposals proposals={this.state.proposals} negotiate={this.props.negotiate}/>
                        <hr/>
                        <Button bsSize="large" bsStyle="primary" block onClick={this.getTradeProposals} disabled={this.state.selectedPlayers.length === 0}>Request Trade Proposals</Button>
                    </Col>
                </Row>
            </PageWrapper>
        );
    }
    
}

function TradeProposals(props){
    const {proposals, negotiate} = props;
    if(proposals.length === 0) return null;
    return (
        <div>
            <hr/>
            {proposals.map(proposal => <TradeProposal proposal={proposal} negotiate={() => negotiate(proposal)}/>)}
        </div>
    );
}

function TradeProposal(props){
    const {proposal, negotiate} = props;
    const {team, offered} = proposal;
    const {players} = offered;
    return (
        <div>
            <h3>Offer from {team.name}</h3>
            <PlayerTable players={players} />
            <Button bsSize="large" bsStyle="primary" block onClick={negotiate}>Negotiate</Button>
        </div>
    );
}


// WEBPACK FOOTER //
// src/pages/TradingBlock.js