import React from 'react';

import GameSetup from '../containers/GameSetup';
import Standings from '../containers/Standings';

export default function Home(props){
    
    if(!props.teamId){
        return <GameSetup {...props} />
    }
    
    return (
        <Standings {...props} />
    );
    
}


// WEBPACK FOOTER //
// src/pages/Home.js