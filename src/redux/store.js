import { createStore, combineReducers } from "redux";
import reducer from "./reducers/view";

// export default createStore(combineReducers({reducer}));
export default createStore(reducer);