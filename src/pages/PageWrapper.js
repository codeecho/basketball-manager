import React from 'react';

import {GAME_STATE_REGULAR_SEASON, GAME_STATE_END_OF_SEASON} from '../constants';

export default function PageWrapper(props){
    
    const teamHref = `#/team/${props.teamId}`;
    
    return (
        <div>
            <div>
                <a href="#/">Home</a>
                <a href={teamHref}>My Team</a>
                <span>{props.stage}</span>
                <UserActions {...props} />
                <Log messages={props.logMessages} />
            </div>
            <div>
                {props.children}
            </div>
        </div>
    )
    
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
    const {stage} = props;
    switch(stage){
        case(GAME_STATE_REGULAR_SEASON): return <RegularSeasonUserActions {...props} />
        case(GAME_STATE_END_OF_SEASON): return <EndOfSeasonUserActions {...props} />
        default: return null;
    }
}

function RegularSeasonUserActions(props){
    return (
        <div>
            <button onClick={props.advance}>Play Next Round</button>        
        </div>
    );
}

function EndOfSeasonUserActions(props){
    return (
        <div>
            <button onClick={props.endSeason}>End Season</button>        
        </div>
    );    
}