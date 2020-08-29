import { combineReducers } from 'redux';
import view from './view';
import focus from './focus';

export default combineReducers({
  view,
  focus
})