import React, { Component } from 'react';

import {Modal, Button} from 'react-bootstrap';

import eventHandler from '../utils/eventHandler';

export default class ModalWrapper extends Component{
    
    constructor(props){
        super(props);
        
        this.state = {
            show: false,
            title: '',
            body: ''
        }
        
        this.close = this.close.bind(this);
        
        eventHandler.listen('showModal', (type, event) => {
            this.setState({
                title: event.title,
                body: event.body,
                show: true
            });
        });
    }
    
    close(){
        this.setState({show: false});
    }
    
    render(){
        return (
            <Modal bsSize="large" show={this.state.show} onHide={this.close}>
    			{this.state.title && <Modal.Header closeButton>
    				<Modal.Title>{this.state.title}</Modal.Title>
    			</Modal.Header>}
    			<Modal.Body>
    				{React.cloneElement(this.state.body, {closeModal: this.close})}
    			</Modal.Body>
    			<Modal.Footer>
    				<Button bsSize="large" block bsStyle="primary" onClick={this.close}>Close</Button>
    			</Modal.Footer>
    		</Modal>
    	);
    }
    
}