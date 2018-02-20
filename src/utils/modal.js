import eventHandler from './eventHandler';

class Modal{
    
    show(options){
        eventHandler.emit('showModal', options);
    }
    
}

const modal = new Modal();

export default modal;


// WEBPACK FOOTER //
// src/utils/modal.js