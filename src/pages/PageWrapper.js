import React from 'react';

import {GAME_STATE_REGULAR_SEASON, GAME_STATE_END_OF_SEASON} from '../constants';

export default function PageWrapper(props){
    
    const teamHref = `#/team/${props.teamId}`;
    
    return (
        <div>
            <div>
                <a href="#/">Home</a>
                <a href={teamHref}>My Team</a>
                <a href="#/freeAgents">Free Agents</a>
                <span>{props.stage}</span>
                <UserActions {...props} />
                {!props.isOnlineGame && <button onClick={props.hostOnlineGame}>Host Online Game</button>}
                {!props.isOnlineGame && <button onClick={props.joinOnlineGame}>Join Online Game</button>}
                {props.isOnlineGame && <OnlineGameStatus {...props}/>}
                <button onClick={props.newGame}>New Game</button>
                <Log messages={props.logMessages} />
            </div>
            <div>
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

function Log(props){
    const {messages} = props;
    return (
        <div>
            {messages.map(message => <LogMessage {...message} />)}
        </div>
    );
}

function LogMessage(props){
    const {text} = props;
    return (
        <div>{text}</div>
    );
}

function UserActions(props){
    return (<div>
        {!props.isOnlineGame && <button onClick={props.advance}>Play Next Round</button>}
        {props.isOnlineGame && <button onClick={props.playerReady}>Play Next Round</button>}
    </div>)
}