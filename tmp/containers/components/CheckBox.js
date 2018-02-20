import React, {Component} from 'react';

import {Glyphicon} from 'react-bootstrap';

export default class CheckBox extends Component{
    
    constructor(props){
        super(props);
        
        this.state = {
            checked: props.checked
        }
        
        this.toggle = this.toggle.bind(this);
    }
    
    toggle(){
        this.setState({ checked: !this.state.checked });
    }
    
    render(){
        const glyph = this.state.checked ? 'ok' : 'unchecked';
        return <Glyphicon glyph={glyph} onClick={this.toggle} />
    }
    
}


// WEBPACK FOOTER //
// src/components/CheckBox.js