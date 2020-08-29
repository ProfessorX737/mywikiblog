import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers";
import middleware from "./middleware";

export default createStore(
  rootReducer,
  applyMiddleware(...middleware)
);