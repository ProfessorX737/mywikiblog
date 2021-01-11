import history from '../common/history';
import * as authActions from './auth-actions';
import axios from '../common/api-client';
import * as types from './actionTypes';
import * as routes from '../constants/routes';
import { setToken, deleteToken } from '../common/localStorage';

const loginLogic = store => next => async action => {
  if(action.type === types.LOGIN) {
    const {
      email,
      password
    } = action.payload;
    try {
      const data = await axios.post(`${routes.routeStem}/login`, {
        email,
        password,
      }).then(res => res.data);
      setToken(data);
      history.push(routes.getHomeRoute(''));
      next(action);
    } catch (e) {
      console.log(e);
    }
  } else {
    next(action);
  }
}

const logoutLogic = store => next => async action => {
  if(action.type === types.LOGOUT) {
    try {
      deleteToken();
      next(action);
    } catch(e) {
      console.log(e);
    }
  } else {
    next(action);
  }
}

const updateAuthStatusLogic = store => next => async action => {
  if(action.type === types.UPDATE_AUTH_STATUS) {
    try {
      await axios.get(`${routes.routeStem}/is-auth`)
      next(authActions.login({}))
    } catch (e) {
      next(authActions.logout())
      console.log(e);
    }
  } else {
    next(action);
  }
}

export default [
  loginLogic,
  logoutLogic,
  updateAuthStatusLogic,
];