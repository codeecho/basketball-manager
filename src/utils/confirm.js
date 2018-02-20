import eventHandler from './eventHandler';

class Confirm{
    
    show(options){
        eventHandler.emit('showConfirmModal', options);
    }
    
}

const confirm = new Confirm();

export default confirm;


// WEBPACK FOOTER //
// src/utils/confirm.js