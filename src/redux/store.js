import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import viewMiddleware from './view-middleware';
import authMiddleware from './auth-middleware';

const store = createStore(
  rootReducer,
  applyMiddleware(...viewMiddleware, ...authMiddleware)
);

export default store;