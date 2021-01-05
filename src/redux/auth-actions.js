import * as types from './actionTypes';

export function login({
  email,
  password
}) {
  return ({
    type: types.LOGIN,
    payload: arguments[0],
  })
}

export function logout() {
  return ({
    type: types.LOGOUT,
  })
}

export function updateAuthStatus() {
  return ({
    type: types.UPDATE_AUTH_STATUS,
  })
}