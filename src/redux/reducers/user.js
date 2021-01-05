import update from "immutability-helper";

import * as types from "../actionTypes";

const initialState = {
  email: "xavierpoon737@gmail.com",
  loggedIn: false,
}

export default function (state = initialState, action) {
  switch (action.type) {
    case types.LOGIN: {
      const { email } = action.payload;
      return update(state, { email: { $set: email ? email : state.email }, loggedIn: { $set: true } });
    }
    case types.LOGOUT: {
      return update(state, { loggedIn: { $set: false } });
    }
    default: {
      return state
    }
  }
}
