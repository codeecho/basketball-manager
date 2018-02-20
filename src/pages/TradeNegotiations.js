import './styles/TradeNegotiations.less';

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

import {TRADE_TAB_ID, tradeTabs} from './tabs/tabs';

export default class TradingNegotiations extends Component{
    
    constructor(props){
        super(props);
        
        const {teams, players, proposal} = props;
        
        const selectedUserPlayers = proposal ? proposal.requested.players : [];
        const unselectedUserPlayers = proposal ? props.userPlayers.filter(player => !proposal.requested.players.includes(player)) : props.userPlayers;
        
        const selectedCPUTeam = proposal ? proposal.team: teams[0];
        
        const selectedCPUPlayers = proposal ? proposal.offered.players : [];
        const unselectedCPUPlayers = players.filter(player => player.teamId === selectedCPUTeam.id && (!proposal || !proposal.offered.players.includes(player)));
        
        this.state = {
            selectedCPUTeam: selectedCPUTeam,
            unselectedUserPlayers,
            selectedUserPlayers,
            unselectedCPUPlayers,
            selectedCPUPlayers,
            salaryOut: 0,
            salaryIn: 0
        }
        
        this.tradeService = new TradeService(teams, players);
        
        this.selectTeam = this.selectTeam.bind(this);
        this.selectUserPlayer = this.selectUserPlayer.bind(this);
        this.deselectUserPlayer = this.deselectUserPlayer.bind(this);
        this.selectCPUPlayer = this.selectCPUPlayer.bind(this);
        this.deselectCPUPlayer = this.deselectCPUPlayer.bind(this);    
        
        this.showUserPlayerSelectModal = this.showUserPlayerSelectModal.bind(this);
        this.showCPUPlayerSelectModal = this.showCPUPlayerSelectModal.bind(this);
        
        this.proposeTrade = this.proposeTrade.bind(this);
    }
    
    componentWillMount(){
        this.calculateSalaryTotals();
    }
    
    selectTeam(teamId){
        const team = this.props.teams.find(team => team.id === teamId);
        const unselectedCPUPlayers = this.props.players.filter(player => player.teamId === teamId);
        this.setState({
            selectedCPUTeam: team,
            unselectedCPUPlayers,
            selectedCPUPlayers: []
        }, () => this.calculateSalaryTotals());
    }
    
    selectUserPlayer(selectedPlayer){
        const unselectedUserPlayers = this.state.unselectedUserPlayers.filter(player => player !== selectedPlayer);
        const selectedUserPlayers = this.state.selectedUserPlayers.filter(player => player !== selectedPlayer).concat(selectedPlayer);
        this.setState({
            unselectedUserPlayers,
            selectedUserPlayers
        }, () => this.calculateSalaryTotals());
    }
    
    deselectUserPlayer(selectedPlayer){
        const selectedUserPlayers = this.state.selectedUserPlayers.filter(player => player !== selectedPlayer);
        const unselectedUserPlayers = this.state.unselectedUserPlayers.filter(player => player !== selectedPlayer).concat(selectedPlayer);
        this.setState({
            unselectedUserPlayers,
            selectedUserPlayers
        }, () => this.calculateSalaryTotals());
    }
    
    selectCPUPlayer(selectedPlayer){
        const unselectedCPUPlayers = this.state.unselectedCPUPlayers.filter(player => player !== selectedPlayer);
        const selectedCPUPlayers = this.state.selectedCPUPlayers.filter(player => player !== selectedPlayer).concat(selectedPlayer);
        this.setState({
            unselectedCPUPlayers,
            selectedCPUPlayers
        }, () => this.calculateSalaryTotals());
    }
    
    deselectCPUPlayer(selectedPlayer){
        const selectedCPUPlayers = this.state.selectedCPUPlayers.filter(player => player !== selectedPlayer);
        const unselectedCPUPlayers = this.state.unselectedCPUPlayers.filter(player => player !== selectedPlayer).concat(selectedPlayer);
        this.setState({
            unselectedCPUPlayers,
            selectedCPUPlayers
        }, () => this.calculateSalaryTotals());
    }
    
    calculateSalaryTotals(){
        const {selectedUserPlayers, selectedCPUPlayers} = this.state;
        const salaryOut = selectedUserPlayers.reduce((total, player) => total + player.salary, 0);
        const salaryIn = selectedCPUPlayers.reduce((total, player) => total + player.salary, 0);
        this.setState({
            salaryOut,
            salaryIn
        });
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
        const proposedTrade = {
            offered: {
                players: this.state.selectedUserPlayers
            },
            toTeam: this.state.selectedCPUTeam,
            fromTeam: this.props.userTeam,
            requested: {
                players: this.state.selectedCPUPlayers
            }
        };
        
        const result = this.tradeService.assessTrade(proposedTrade);
        
        if(!result.acceptable){
            toast.warning('Trade Rejected');
        }else{
            confirm.show({
                text: 'This trade has been accepted. Confirm you are happy to complete the trade.',
                onConfirm: () => {
                    const trade = {
                        offered: {
                            playerIds: this.state.selectedUserPlayers.map(player => player.id)
                        },
                        toTeamId: this.state.selectedCPUTeam.id,
                        fromTeamId: this.props.userTeam.id,
                        requested: {
                            playerIds: this.state.selectedCPUPlayers.map(player => player.id)
                        }
                    };
                    this.props.completeTrade(trade);
                }
            });
        }
    }
    
    render(){
        const {userPlayers, teams, salaryCap, userTeam} = this.props;
        const {selectedCPUTeam, salaryOut, salaryIn} = this.state;
        
        const userPayrollAfterTrade = userTeam.payroll - salaryOut + salaryIn;
        const cpuPayrollAfterTrade = selectedCPUTeam.payroll + salaryOut - salaryIn
    
        const tradeAllowed = userPayrollAfterTrade <= salaryCap && cpuPayrollAfterTrade <= salaryCap;    
        
        return (
            <PageWrapper id="trade-page" title="Trading Block" tabs={tradeTabs} selectedTab={TRADE_TAB_ID}>
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
                        <TeamSelect teams={teams} selectedTeamId={this.state.selectedCPUTeam.id} onSelect={this.selectTeam}/>
                        <PlayerTable players={this.state.selectedCPUPlayers} onSelect={this.deselectCPUPlayer} selectButtonStyle="danger" selectIcon="minus" />
                        <Button bsSize="large" bsStyle="info" block onClick={this.showCPUPlayerSelectModal}>Add Player</Button>
                    </Col>
                </Row>
                <hr/>
                <Row>
                    <Col md={6}>
                        <SalaryTable payroll={userTeam.payroll} salaryOut={salaryOut} salaryIn={salaryIn} payrollAfter={userPayrollAfterTrade} cap={salaryCap} />
                    </Col>
                    <Col md={6}>
                        <SalaryTable payroll={selectedCPUTeam.payroll} salaryOut={salaryIn} salaryIn={salaryOut} payrollAfter={cpuPayrollAfterTrade} cap={salaryCap} />
                    </Col>
                </Row>
                <hr/>
                <Row>
                    <Col xs={12}>
                        <Button disabled={!tradeAllowed} bsSize="large" bsStyle="primary" block onClick={this.proposeTrade}>Propose Trade</Button>
                    </Col>
                </Row>
            </PageWrapper>
        );
    }
    
}

function SalaryTable(props){
    const {payroll, salaryIn, salaryOut, payrollAfter, cap} = props;
    const className = payrollAfter > cap ? 'danger' : 'success';
    return (
        <Table>
            <tbody>
                <tr>
                    <th>Current Payroll</th>
                    <td>${payroll}M</td>
                </tr>
                <tr>
                    <th>Salary Out</th>
                    <td>${salaryOut}M</td>
                </tr>
                <tr>
                    <th>Salary In</th>
                    <td>${salaryIn}M</td>
                </tr>
                <tr>
                    <th>Salary Difference</th>
                    <td>${salaryIn - salaryOut}M</td>
                </tr>
                <tr className={className}>
                    <th>Payroll After Trade</th>
                    <td>${payrollAfter}M</td>
                </tr>
                <tr>
                    <th>Salary Cap</th>
                    <td>${cap}M</td>
                </tr>
            </tbody>
        </Table>
    );
}


// WEBPACK FOOTER //
// src/pages/TradeNegotiations.js