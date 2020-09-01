import { combineReducers } from 'redux';
import view from './view';
import user from './user';

export default combineReducers({
  view,
  user
})