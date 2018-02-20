class EventHandler{
    
    constructor(){
        this.listeners = {};
    }
    
    listen(eventType, callback){
        let listeners = this.listeners[eventType];
        if(!listeners){
            listeners = [];
            this.listeners[eventType] = listeners;
        }
        listeners.push(callback);
    }
    
    emit(type, event){
        const listeners = this.listeners[type] || [];
        listeners.forEach(listener => listener(type, event));
    }
    
}

const eventHandler = new EventHandler();

export default eventHandler;


// WEBPACK FOOTER //
// src/utils/eventHandler.js