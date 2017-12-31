import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducer from './reducer';
import rootEpic from './epics';

const epicMiddleware = createEpicMiddleware(rootEpic);

const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(epicMiddleware)
  )
);

export default store;
