import axios from 'axios';
import history from './history';
import store from '../redux/store';
import * as routes from '../constants/routes';
import { getToken } from './localStorage';

axios.interceptors.response.use((res) => res, (error) => {
  console.log("intercepted error: " + error.response.data);
  throw Error(error.response.data);
});

axios.interceptors.request.use((req) => {
  const token = getToken();
  req.headers.Authorization = token;
  return req;
});

axios.defaults.withCredentials = true;

export default axios;