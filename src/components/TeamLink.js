import React from 'react';

export default function TeamLink(props){
    
    const {id, name} = props.team;
    
    const href = `#/team/${id}`;
    
    return <a href={href}>{name}</a>
    
}


// WEBPACK FOOTER //
// src/components/TeamLink.js