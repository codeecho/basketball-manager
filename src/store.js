import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import createSocketIoMiddleware from 'redux-socket.io';
import { composeWithDevTools } from 'redux-devtools-extension';

import io from 'socket.io-client';

import config from './config/config.js';

import rootReducer from './reducers/rootReducer';
import rootEpic from './epics';

const epicMiddleware = createEpicMiddleware(rootEpic);

const socket = io(config.server);

const socketIoMiddleware = createSocketIoMiddleware(socket, "server/");

const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(epicMiddleware, socketIoMiddleware)
  )
);

export default store;



// WEBPACK FOOTER //
// src/store.js