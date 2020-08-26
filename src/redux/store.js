import { createStore, applyMiddleware } from "redux";
import reducer from "./reducers/view";
import * as types from "./actionTypes";
import middleware from "./middleware";

// export default createStore(combineReducers({reducer}));
export default createStore(reducer, applyMiddleware(...middleware));