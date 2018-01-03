import React from 'react';

import PageWrapper from '../containers/PageWrapper';

export default function FreeAgents(props){
    
    const {freeAgents} = props;
    
    return (
        <PageWrapper>
            <div>
                <table>
                    <tbody>
                        { freeAgents.map(freeAgent => <FreeAgent {...freeAgent}/>) }
                    </tbody>
                </table>
            </div>
        </PageWrapper>
    );
    
}

function FreeAgent(props){
    const {id, name} = props;
    const playerHref = `#/player/${id}`;
    return (
        <tr>
            <td>
                <a href={playerHref}>{name}</a>
            </td>
        </tr>
    )
}