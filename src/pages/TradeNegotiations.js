import React, {Component} from 'react';

import {Row, Col, Button, Table} from 'react-bootstrap';

import PageWrapper from '../containers/PageWrapper';

import PlayerTable from '../components/PlayerTable';
import TeamSelect from '../components/TeamSelect';
import PlayerSelect from '../components/PlayerSelect';

import TradeService from '../services/TradeService';

import modal from '../utils/modal';
import confirm from '../utils/confirm';

import {toast} from 'react-toastify';

export default class TradingNegotiations extends Component{
    
    constructor(props){
        super(props);
        
        const {teams, players, proposal} = props;
        
        const selectedUserPlayers = proposal ? proposal.requested.players : [];
        const unselectedUserPlayers = proposal ? props.userPlayers.filter(player => !proposal.requested.players.includes(player)) : props.userPlayers;
        
        const selectedCPUTeamId = proposal ? proposal.team.id : teams[0].id;
        const selectedCPUPlayers = proposal ? proposal.offered.players : [];
        const unselectedCPUPlayers = players.filter(player => player.teamId === selectedCPUTeamId && (!proposal || !proposal.offered.players.includes(player)));
        
        this.state = {
            selectedTeamId: selectedCPUTeamId,
            unselectedUserPlayers,
            selectedUserPlayers,
            unselectedCPUPlayers,
            selectedCPUPlayers
        }
        
        this.tradeService = new TradeService();
        
        this.selectTeam = this.selectTeam.bind(this);
        this.selectUserPlayer = this.selectUserPlayer.bind(this);
        this.deselectUserPlayer = this.deselectUserPlayer.bind(this);
        this.selectCPUPlayer = this.selectCPUPlayer.bind(this);
        this.deselectCPUPlayer = this.deselectCPUPlayer.bind(this);    
        
        this.showUserPlayerSelectModal = this.showUserPlayerSelectModal.bind(this);
        this.showCPUPlayerSelectModal = this.showCPUPlayerSelectModal.bind(this);
        
        this.proposeTrade = this.proposeTrade.bind(this);
    }
    
    selectTeam(teamId){
        const unselectedCPUPlayers = this.props.players.filter(player => player.teamId === teamId);
        this.setState({
            unselectedCPUPlayers,
            selectedCPUPlayers: []
        });
    }
    
    selectUserPlayer(selectedPlayer){
        const unselectedUserPlayers = this.state.unselectedUserPlayers.filter(player => player !== selectedPlayer);
        const selectedUserPlayers = this.state.selectedUserPlayers.filter(player => player !== selectedPlayer).concat(selectedPlayer);
        this.setState({
            unselectedUserPlayers,
            selectedUserPlayers
        })
    }
    
    deselectUserPlayer(selectedPlayer){
        const selectedUserPlayers = this.state.selectedUserPlayers.filter(player => player !== selectedPlayer);
        const unselectedUserPlayers = this.state.unselectedUserPlayers.filter(player => player !== selectedPlayer).concat(selectedPlayer);
        this.setState({
            unselectedUserPlayers,
            selectedUserPlayers
        })
    }
    
    selectCPUPlayer(selectedPlayer){
        const unselectedCPUPlayers = this.state.unselectedCPUPlayers.filter(player => player !== selectedPlayer);
        const selectedCPUPlayers = this.state.selectedCPUPlayers.filter(player => player !== selectedPlayer).concat(selectedPlayer);
        this.setState({
            unselectedCPUPlayers,
            selectedCPUPlayers
        })
    }
    
    deselectCPUPlayer(selectedPlayer){
        const selectedCPUPlayers = this.state.selectedCPUPlayers.filter(player => player !== selectedPlayer);
        const unselectedCPUPlayers = this.state.unselectedCPUPlayers.filter(player => player !== selectedPlayer).concat(selectedPlayer);
        this.setState({
            unselectedCPUPlayers,
            selectedCPUPlayers
        })
    }
    
    showUserPlayerSelectModal(){
        modal.show({
            body: <PlayerSelect players={this.state.unselectedUserPlayers} selectPlayer={this.selectUserPlayer} />
        });
    }
    
    showCPUPlayerSelectModal(){
        modal.show({
            body: <PlayerSelect players={this.state.unselectedCPUPlayers} selectPlayer={this.selectCPUPlayer} />
        });
    }
    
    proposeTrade(){
        const trade = {
            offered: {
                players: this.state.selectedUserPlayers
            },
            team: this.state.selectedTeamId,
            requested: {
                players: this.state.selectedCPUPlayers
            }
        };
        
        const result = this.tradeService.assessTrade(trade);
        
        if(!result.acceptable){
            toast.warning('Trade Rejected');
        }else{
            confirm.show({
                text: 'This trade has been accepted. Confirm you are happy to complete the trade.',
                onConfirm: () => {
                    this.props.completeTrade(trade);
                }
            });
        }
    }
    
    render(){
        const {userPlayers, teams} = this.props;
    
        return (
            <PageWrapper>
                <Row>
                    <Col md={6}>
                        <h5>&nbsp;</h5>
                        <PlayerTable players={this.state.selectedUserPlayers} onSelect={this.deselectUserPlayer} selectButtonStyle="danger" selectIcon="minus" />
                        <Button bsSize="large" bsStyle="info" block onClick={this.showUserPlayerSelectModal}>Add Player</Button>
                    </Col>
                    <Col mdHidden lgHidden>
                        <hr/>
                    </Col>
                    <Col md={6}>
                        <TeamSelect teams={teams} selectedTeamId={this.state.selectedTeamId} onSelect={this.selectTeam}/>
                        <PlayerTable players={this.state.selectedCPUPlayers} onSelect={this.deselectCPUPlayer} selectButtonStyle="danger" selectIcon="minus" />
                        <Button bsSize="large" bsStyle="info" block onClick={this.showCPUPlayerSelectModal}>Add Player</Button>
                    </Col>
                </Row>
                <hr/>
                <Row>
                    <Col xs={12}>
                        <Button bsSize="large" bsStyle="primary" block onClick={this.proposeTrade}>Propose Trade</Button>
                    </Col>
                </Row>
            </PageWrapper>
        );
    }
    
}