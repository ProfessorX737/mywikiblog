import * as types from "../actionTypes"

const initialState = {}

export default function (state = initialState, action) {
  switch (action.type) {
    case types.SET_FOCUS_DATA: {
      return {
        data: action.payload
      }
    }
    default: {
      return state
    }
  }
}
