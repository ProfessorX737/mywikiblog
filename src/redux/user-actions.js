import * as types from './actionTypes';

export function setLoggedIn({
  isLoggedIn,
}) {
  return ({
    type: types.SET_LOGGED_IN,
    payload: arguments[0],
  })
}

export function setEmail({
  email,
}) {
  return ({
    type: types.SET_EMAIL,
    payload: arguments[0],
  })
}
