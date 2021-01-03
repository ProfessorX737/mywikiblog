import update from "immutability-helper";

import * as types from "../actionTypes";

const initialState = {
  email: "xavierpoon737@gmail.com",
  loggedIn: false,
}

export default function (state = initialState, action) {
  switch (action.type) {
    case types.SET_LOGGED_IN: {
      const { isLoggedIn } = action.payload;
      return update(state, { loggedIn: { $set: isLoggedIn } });
    }
    case types.SET_EMAIL: {
      const { email } = action.payload;
      return update(state, { email: { $set: email } });
    }
    default: {
      return state
    }
  }
}
