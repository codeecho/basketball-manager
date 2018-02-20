import React, { Component } from 'react';

import {Modal, Button, Row, Col} from 'react-bootstrap';

import eventHandler from '../utils/eventHandler';

export default class ConfirmModal extends Component{
    
    constructor(props){
        super(props);
        
        this.state = {
            show: false,
            title: '',
            body: '',
            onConfirm: undefined,
            onCancel: undefined
        }
        
        this.confirm = this.confirm.bind(this);
        this.cancel = this.cancel.bind(this);
        
        eventHandler.listen('showConfirmModal', (type, event) => {
            this.setState({
                title: event.title,
                body: event.body || <div>{event.text}</div>,
                show: true,
                onConfirm: event.onConfirm,
                onCancel: event.onCancel
            });
        });
    }
    
    cancel(){
        this.setState({show: false});
        if(this.state.onCancel) this.state.onCancel();
    }
    
    confirm(){
        this.setState({show: false});
        if(this.state.onConfirm) this.state.onConfirm();        
    }
    
    render(){
        return (
            <Modal bsSize="large" show={this.state.show} onHide={this.cancel}>
    			{this.state.title && <Modal.Header closeButton>
    				<Modal.Title>{this.state.title}</Modal.Title>
    			</Modal.Header>}
    			<Modal.Body>
    				{React.cloneElement(this.state.body, {closeModal: this.close})}
    			</Modal.Body>
    			<Modal.Footer>
                    <Row>
                        <Col xs={3}>
        				    <Button bsSize="large" block bsStyle="warning" onClick={this.cancel} className="zcancel-button">Cancel</Button>
        			    </Col>
        			    <Col xs={9}>
        			        <Button bsSize="large" block bsStyle="primary" onClick={this.confirm} className="zconfirm-button">Confirm</Button>
        			    </Col>
    			    </Row>
    			</Modal.Footer>
    		</Modal>
    	);
    }
    
}


// WEBPACK FOOTER //
// src/components/ConfirmModal.js