import React from 'react';

import { Navbar, Nav, NavItem, NavDropdown, Button, MenuItem, Glyphicon} from 'react-bootstrap';

import {GAME_STATE_REGULAR_SEASON, GAME_STATE_END_OF_SEASON} from '../constants';

export default function PageWrapper(props){
    
    const {id, title, teamId, tabs = [], selectedTab, stage, year, draftType, isOnlineGame, isHost, canAdvance} = props;
    
    const teamHref = `#/team/${teamId}`;
    
    return (
        
        <div id={id}>
        
            <Navbar fluid className='header'>
                  <Navbar.Brand>
                    <Glyphicon glyph="chevron-left" className="history-button" onClick={() => window.history.back()} />
                    <Glyphicon glyph="chevron-right" className="history-button" onClick={() => window.history.forward()} />
                    <span className="title">{title || 'Basketball Manager'}</span>
                    <span className="subtitle">{stage + ' ' + year}</span>
                  </Navbar.Brand>
                {props.teamId &&
                    <Nav pullRight>
                      {(stage === GAME_STATE_REGULAR_SEASON && (!isOnlineGame || isHost)) && <NavDropdown eventKey={1} title="Continue" disabled={!canAdvance}>
                        <MenuItem eventKey={1.1} onClick={() => props.advance(isOnlineGame, 1)}>Play Next Round</MenuItem>
                        <MenuItem eventKey={1.2} onClick={() => props.advance(isOnlineGame, 5)}>Play Next 5 Rounds</MenuItem>
                        <MenuItem eventKey={1.3} onClick={() => props.advance(isOnlineGame, 10)}>Play Next 10 Rounds</MenuItem>
                        <MenuItem eventKey={1.3} onClick={() => props.advance(isOnlineGame, 99)}>Play Full Season</MenuItem>                        
                    </NavDropdown>}
                    {(stage !== GAME_STATE_REGULAR_SEASON || (isOnlineGame && !isHost)) && <NavItem onClick={() => props.advance(isOnlineGame, 1)} disabled={!canAdvance}>Continue</NavItem>                  }
                                        </Nav>}
                 <div className="pull-left tabs">
                    {tabs.map(tab => <a href={tab.target} className={tab.id === selectedTab ? 'active' : ''}>{tab.label}</a>)}                   
                </div>
            </Navbar>
            
            <Navbar className='sidebar' fluid>
                {props.teamId &&
                  <Nav>
                    <NavItem href="#/standings" title="Home"><Glyphicon glyph="home"/></NavItem>                  
                    <NavItem href={teamHref} title="Team"><Glyphicon glyph="user"/></NavItem>
                    <NavItem href="#/standings" title="Standings"><Glyphicon glyph="list"/></NavItem>
                    <NavItem href="#/freeAgents" title="Free Agents"><Glyphicon glyph="pencil"/></NavItem>
                    <NavItem onClick={props.trade} title="Trade"><Glyphicon glyph="transfer"/></NavItem>                    
                    {!draftType && <NavItem href="#/draft" title="Draft"><Glyphicon glyph="list-alt"/></NavItem>}
                    <NavItem href="#/settings" title="Settings"><Glyphicon glyph="cog"/></NavItem>                    
                  </Nav>}
            </Navbar>
            
            {props.teamId && false && <div className="bg-info">
                <div className="container">
                    <span>{props.stage} {props.year}</span>
                </div>
            </div>}
            
            {props.isOnlineGame && <div className="bg-success">
                <div className="container">
                    <OnlineGameStatus {...props}/>
                </div>
            </div>}
             
            <div className="container-fluid main-content">
                {props.children}
            </div>
        </div>
    )
    
}

function OnlineGameStatus(props){
    const {playersNotReady, waitingForPlayers, numberOfPlayers, playersReady} = props;
    return (
        <div style={{color: 'white'}}>
        <span> Game Id: {props.onlineGame.id} </span>
        <span>{numberOfPlayers} connected </span>
        <span>{playersReady} ready</span>
        </div>
    );
}



// WEBPACK FOOTER //
// src/pages/PageWrapper.js