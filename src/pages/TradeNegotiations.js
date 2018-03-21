import './styles/TradeNegotiations.less';

import React, {Component} from 'react';

import {Row, Col, Button, Table} from 'react-bootstrap';

import PageWrapper from '../containers/PageWrapper';

import PlayerTable from '../components/PlayerTable';
import TeamSelect from '../components/TeamSelect';
import PlayerSelect from '../components/PlayerSelect';
import DraftPickTable from '../containers/DraftPickTable';
import DraftPickSelect from '../components/DraftPickSelect';

import TeamService from '../services/TeamService';
import TradeService from '../services/TradeService';

import modal from '../utils/modal';
import confirm from '../utils/confirm';

import {toast} from 'react-toastify';

import {TRADE_TAB_ID, tradeTabs} from './tabs/tabs';

export default class TradingNegotiations extends Component{
    
    constructor(props){
        super(props);
        
        const {teams, players, proposal, year, tradedPicks} = props;
        
        this.teamService = new TeamService();
        this.tradeService = new TradeService(teams, players);
        
        const selectedUserPlayers = proposal ? proposal.requested.players : [];
        const unselectedUserPlayers = proposal ? props.userPlayers.filter(player => !proposal.requested.players.includes(player)) : props.userPlayers;
        
        const selectedUserDraftPicks = proposal ? proposal.requested.picks : [];
        const unselectedUserDraftPicks = proposal ? props.userDraftPicks.filter(pick => !proposal.requested.picks.includes(pick)) : props.userDraftPicks;
        
        const selectedCPUTeam = proposal ? proposal.team: teams[0];
        
        const selectedCPUPlayers = proposal ? proposal.offered.players : [];
        const unselectedCPUPlayers = players.filter(player => player.teamId === selectedCPUTeam.id && (!proposal || !proposal.offered.players.includes(player)));

        const cpuDraftPicks = this.teamService.getDraftPicks(selectedCPUTeam.id, year, 4, tradedPicks);
        const selectedCPUDraftPicks = proposal ? proposal.offered.picks : [];
        const unselectedCPUDraftPicks = proposal ? cpuDraftPicks.filter(pick => !proposal.offered.picks.includes(pick)) : cpuDraftPicks;
        
        this.state = {
            selectedCPUTeam: selectedCPUTeam,
            unselectedUserPlayers,
            selectedUserPlayers,
            unselectedUserDraftPicks,
            selectedUserDraftPicks,
            unselectedCPUPlayers,
            selectedCPUPlayers,
            unselectedCPUDraftPicks,
            selectedCPUDraftPicks,
            salaryOut: 0,
            salaryIn: 0
        };
        
        this.selectTeam = this.selectTeam.bind(this);
        
        this.selectUserPlayer = this.selectUserPlayer.bind(this);
        this.deselectUserPlayer = this.deselectUserPlayer.bind(this);
        
        this.selectUserDraftPick = this.selectUserDraftPick.bind(this);
        this.deselectUserDraftPick = this.deselectUserDraftPick.bind(this);        
        
        this.selectCPUPlayer = this.selectCPUPlayer.bind(this);
        this.deselectCPUPlayer = this.deselectCPUPlayer.bind(this);    
        
        this.selectCPUDraftPick = this.selectCPUDraftPick.bind(this);
        this.deselectCPUDraftPick = this.deselectCPUDraftPick.bind(this);                
        
        this.showUserPlayerSelectModal = this.showUserPlayerSelectModal.bind(this);
        this.showUserDraftPicksSelectModal = this.showUserDraftPicksSelectModal.bind(this);        
        this.showCPUPlayerSelectModal = this.showCPUPlayerSelectModal.bind(this);
        this.showCPUDraftPicksSelectModal = this.showCPUDraftPicksSelectModal.bind(this);         
        
        this.proposeTrade = this.proposeTrade.bind(this);
    }
    
    componentWillMount(){
        this.calculateSalaryTotals();
    }
    
    selectTeam(teamId){
        const team = this.props.teams.find(team => team.id === teamId);
        const unselectedCPUPlayers = this.props.players.filter(player => player.teamId === teamId);
        const unselectedCPUDraftPicks = this.teamService.getDraftPicks(teamId, this.props.year, 4, this.props.tradedPicks);
        this.setState({
            selectedCPUTeam: team,
            unselectedCPUPlayers,
            selectedCPUPlayers: [],
            selectedCPUDraftPicks: [],
            unselectedCPUDraftPicks
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
    
    selectUserDraftPick(selectedDraftPick){
        const unselectedUserDraftPicks = this.state.unselectedUserDraftPicks.filter(pick => !(pick.year === selectedDraftPick.year && pick.round === selectedDraftPick.round && pick.teamId === selectedDraftPick.teamId));
        const selectedUserDraftPicks = this.state.selectedUserDraftPicks.filter(pick => !(pick.year === selectedDraftPick.year && pick.round === selectedDraftPick.round && pick.teamId === selectedDraftPick.teamId)).concat(selectedDraftPick);
        this.setState({
            unselectedUserDraftPicks,
            selectedUserDraftPicks
        }, () => this.assessTrade());
    }
    
    deselectUserDraftPick(selectedDraftPick){
        const selectedUserDraftPicks = this.state.selectedUserDraftPicks.filter(pick => !(pick.year === selectedDraftPick.year && pick.round === selectedDraftPick.round && pick.teamId === selectedDraftPick.teamId));
        const unselectedUserDraftPicks = this.state.unselectedUserDraftPicks.filter(pick => !(pick.year === selectedDraftPick.year && pick.round === selectedDraftPick.round && pick.teamId === selectedDraftPick.teamId)).concat(selectedDraftPick);
        this.setState({
            unselectedUserDraftPicks,
            selectedUserDraftPicks
        }, () => this.assessTrade());
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
    
    selectCPUDraftPick(selectedDraftPick){
        const unselectedCPUDraftPicks = this.state.unselectedCPUDraftPicks.filter(pick => !(pick.year === selectedDraftPick.year && pick.round === selectedDraftPick.round && pick.teamId === selectedDraftPick.teamId));
        const selectedCPUDraftPicks = this.state.selectedCPUDraftPicks.filter(pick => !(pick.year === selectedDraftPick.year && pick.round === selectedDraftPick.round && pick.teamId === selectedDraftPick.teamId)).concat(selectedDraftPick);
        this.setState({
            unselectedCPUDraftPicks,
            selectedCPUDraftPicks
        }, () => this.assessTrade());
    }
    
    deselectCPUDraftPick(selectedDraftPick){
        const selectedCPUDraftPicks = this.state.selectedCPUDraftPicks.filter(pick => !(pick.year === selectedDraftPick.year && pick.round === selectedDraftPick.round && pick.teamId === selectedDraftPick.teamId));
        const unselectedCPUDraftPicks = this.state.unselectedCPUDraftPicks.filter(pick => !(pick.year === selectedDraftPick.year && pick.round === selectedDraftPick.round && pick.teamId === selectedDraftPick.teamId)).concat(selectedDraftPick);
        this.setState({
            unselectedCPUDraftPicks,
            selectedCPUDraftPicks
        }, () => this.assessTrade());
    }
    
    calculateSalaryTotals(){
        const {selectedUserPlayers, selectedCPUPlayers} = this.state;
        const salaryOut = selectedUserPlayers.reduce((total, player) => total + player.salary, 0);
        const salaryIn = selectedCPUPlayers.reduce((total, player) => total + player.salary, 0);
        this.setState({
            salaryOut,
            salaryIn
        }, () => this.assessTrade());
    }
    
    showUserPlayerSelectModal(){
        modal.show({
            body: <PlayerSelect players={this.state.unselectedUserPlayers} selectPlayer={this.selectUserPlayer} />
        });
    }
    
    showUserDraftPicksSelectModal(){
        modal.show({
            body: <DraftPickSelect draftPicks={this.state.unselectedUserDraftPicks} onSelect={this.selectUserDraftPick} />
        });
    }
    
    showCPUPlayerSelectModal(){
        modal.show({
            body: <PlayerSelect players={this.state.unselectedCPUPlayers} selectPlayer={this.selectCPUPlayer} />
        });
    }
    
    showCPUDraftPicksSelectModal(){
        modal.show({
            body: <DraftPickSelect draftPicks={this.state.unselectedCPUDraftPicks} onSelect={this.selectCPUDraftPick} />
        });
    }
    
    assessTrade(){
        const proposedTrade = {
            year: this.props.year,
            offered: {
                players: this.state.selectedUserPlayers,
                picks: this.state.selectedUserDraftPicks
            },
            toTeam: this.state.selectedCPUTeam,
            fromTeam: this.props.userTeam,
            requested: {
                players: this.state.selectedCPUPlayers,
                picks: this.state.selectedCPUDraftPicks                
            }
        };
        
        const result = this.tradeService.assessTrade(proposedTrade);
        
        this.setState(result);
    }
    
    proposeTrade(){
        const proposedTrade = {
            year: this.props.year,
            offered: {
                players: this.state.selectedUserPlayers,
                picks: this.state.selectedUserDraftPicks                
            },
            toTeam: this.state.selectedCPUTeam,
            fromTeam: this.props.userTeam,
            requested: {
                players: this.state.selectedCPUPlayers,
                picks: this.state.selectedCPUDraftPicks  
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
                            playerIds: this.state.selectedUserPlayers.map(player => player.id),
                            picks: this.state.selectedUserDraftPicks
                        },
                        toTeamId: this.state.selectedCPUTeam.id,
                        fromTeamId: this.props.userTeam.id,
                        requested: {
                            playerIds: this.state.selectedCPUPlayers.map(player => player.id),
                            picks: this.state.selectedCPUDraftPicks                            
                        }
                    };
                    this.props.completeTrade(trade);
                }
            });
        }
    }
    
    render(){
        const {userPlayers, teams, salaryCap, userTeam, canTrade} = this.props;
        
        const {selectedCPUTeam, salaryOut, salaryIn, fromTeamRatings, toTeamRatings, selectedUserPlayers, selectedUserDraftPicks, selectedCPUPlayers, selectedCPUDraftPicks} = this.state;
        
        const userPayrollAfterTrade = userTeam.payroll - salaryOut + salaryIn;
        const cpuPayrollAfterTrade = selectedCPUTeam.payroll + salaryOut - salaryIn
    
        const tradeAllowed = selectedUserPlayers.concat(selectedUserDraftPicks).length > 0 && selectedCPUPlayers.concat(selectedCPUDraftPicks).length > 0 && userPayrollAfterTrade <= salaryCap && cpuPayrollAfterTrade <= salaryCap;    
        
        return (
            <PageWrapper id="trade-page" title="Trading Block" tabs={tradeTabs} selectedTab={TRADE_TAB_ID}>
                {!canTrade && <div>The trade deadline has passed</div>}
                {canTrade && <div><Row>
                    <Col md={6}>
                        <h5>&nbsp;</h5>
                        <PlayerTable players={selectedUserPlayers} onSelect={this.deselectUserPlayer} selectButtonStyle="danger" selectIcon="minus" />
                        <Button bsSize="large" bsStyle="info" block onClick={this.showUserPlayerSelectModal}>Add Player</Button>
                        <hr/>
                        <DraftPickTable draftPicks={selectedUserDraftPicks} onSelect={this.deselectUserDraftPick} selectButtonStyle="danger" selectIcon="minus" />
                        <Button bsSize="large" bsStyle="info" block onClick={this.showUserDraftPicksSelectModal}>Add Draft Pick</Button>                        
                    </Col>
                    <Col mdHidden lgHidden>
                        <hr/>
                    </Col>
                    <Col md={6}>
                        <TeamSelect teams={teams} selectedTeamId={selectedCPUTeam.id} onSelect={this.selectTeam}/>
                        <PlayerTable players={selectedCPUPlayers} onSelect={this.deselectCPUPlayer} selectButtonStyle="danger" selectIcon="minus" />
                        <Button bsSize="large" bsStyle="info" block onClick={this.showCPUPlayerSelectModal}>Add Player</Button>
                        <hr/>
                        <DraftPickTable draftPicks={selectedCPUDraftPicks} onSelect={this.deselectCPUDraftPick} selectButtonStyle="danger" selectIcon="minus" />
                        <Button bsSize="large" bsStyle="info" block onClick={this.showCPUDraftPicksSelectModal}>Add Draft Pick</Button>                        
                    </Col>                    
                </Row>
                <hr/>
                <Row>
                    <Col md={6}>
                        <SalaryTable ratings={fromTeamRatings} payroll={userTeam.payroll} salaryOut={salaryOut} salaryIn={salaryIn} payrollAfter={userPayrollAfterTrade} cap={salaryCap} />
                    </Col>
                    <Col md={6}>
                        <SalaryTable ratings={toTeamRatings} payroll={selectedCPUTeam.payroll} salaryOut={salaryIn} salaryIn={salaryOut} payrollAfter={cpuPayrollAfterTrade} cap={salaryCap} />
                    </Col>
                </Row>
                <hr/>
                <Row>
                    <Col xs={12}>
                        <Button disabled={!tradeAllowed} bsSize="large" bsStyle="primary" block onClick={this.proposeTrade}>Propose Trade</Button>
                    </Col>
                </Row></div>}
            </PageWrapper>
        );
    }
    
}

function SalaryTable(props){
    const {payroll, salaryIn, salaryOut, payrollAfter, cap, ratings} = props;
    const className = payrollAfter > cap ? 'danger' : 'success';
    const salaryDifference = salaryIn - salaryOut;
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
                    <td>${salaryDifference}M</td>
                </tr>
                <tr className={className}>
                    <th>Payroll After Trade</th>
                    <td>${payrollAfter}M</td>
                </tr>
                <tr>
                    <th>Salary Cap</th>
                    <td>${cap}M</td>
                </tr>
                {ratings && <tr>
                    <th>Assessment</th>
                    <td>{ratings.newRating - ratings.existingRating}</td>
                </tr>}
            </tbody>
        </Table>
    );
}


// WEBPACK FOOTER //
// src/pages/TradeNegotiations.js