import React from 'react';

export default function PlayerLink(props){
    
    const {id, name} = props.player;
    
    const href = `#/player/${id}`;
    
    return <a href={href} className="nowrap">{name}</a>
    
}