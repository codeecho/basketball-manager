import React from 'react';

import { Navbar, Nav, NavItem, Button, NavDropdown, MenuItem} from 'react-bootstrap';

import {GAME_STATE_REGULAR_SEASON, GAME_STATE_END_OF_SEASON} from '../constants';

export default function PageWrapper(props){
    
    const teamHref = `#/team/${props.teamId}`;
    
    return (
        
        <div>
        
            <Navbar inverse>
                <Navbar.Header>
                  <Navbar.Brand>
                    <a href="#">Basketball Manager</a>
                  </Navbar.Brand>
                  <Navbar.Toggle />
                </Navbar.Header>
                {props.teamId && <Navbar.Collapse>
                  <Nav>
                    <NavItem href={teamHref}>Team</NavItem>
                    <NavItem href="#/standings">Standings</NavItem>
                    <NavItem href="#/freeAgents">Free Agents</NavItem>
                    <NavItem href="#/draft">Draft</NavItem>
                    {!props.isOnlineGame && <NavDropdown title="Play Online">
                      <MenuItem onClick={props.hostOnlineGame}>Host a Game</MenuItem>
                      <MenuItem onClick={props.joinOnlineGame}>Join a Game</MenuItem>
                    </NavDropdown>}
                    <NavItem onClick={props.newGame}>New Game</NavItem>
                  </Nav>
                  <Nav pullRight>
                    {!props.isOnlineGame && <NavItem onClick={props.advance}>Continue</NavItem>}
                    {props.isOnlineGame && <NavItem onClick={props.playerReady}>Continue</NavItem>}            
                  </Nav>
                </Navbar.Collapse>}
            </Navbar>
            
            {props.teamId && <div className="bg-info">
                <div className="container">
                    <span>{props.stage} {props.year}</span>
                </div>
            </div>}
            
            {props.isOnlineGame && <div className="bg-success">
                <div className="container">
                    <OnlineGameStatus {...props}/>
                </div>
            </div>}
             
            <div className="container">
                {props.children}
            </div>
        </div>
    )
    
}

function OnlineGameStatus(props){
    const {onlineGame} = props;
    const {numberOfPlayers, playersReady} = onlineGame;
    const playersNotReady = numberOfPlayers - playersReady.length;
    const waitingForPlayers = playersNotReady > 0;
    const canAdvance = !waitingForPlayers && onlineGame.isHost;
    return (
        <div>
        <span> Game Id: {props.onlineGame.id} </span>
        {waitingForPlayers && <span>Waiting for {playersNotReady} players</span>}
        </div>
    );
}
