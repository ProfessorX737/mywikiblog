import axios from "axios";
import PropTypes from 'prop-types';

// const routeStem = "https://www.xavierunderstands.com/api"
const routeStem = "http://localhost:5000/api";

const onErrorDefault = error => {
  console.log(error)
}

const fetch = (
  suffix = '',
  payload = {},
  onData,
  onError
) => {
  axios.get(`${routeStem}/${suffix}`, payload)
  .then(({ data }) => {
    onData(data);
  }).catch(err => {
    onError(err);
  })
}

/**
 * 
 * @param {Object} payload 
 * @param {Function} onData 
 * @param {Function} onError 
 */
export const fetchUser = (
  { email },
  onData,
  onError = onErrorDefault
) => {
  fetch(
    'user',
    { params: { email } },
    onData,
    onError
  );
}

/**
 * 
 * @param {Object} payload 
 * @param {Function} onData 
 * @param {Function} onError 
 */
export const fetchCells = (
  { ids },
  onData,
  onError = onErrorDefault
) => {
  fetch(
    'cells',
    { params: { ids } },
    onData,
    onError
  );
}

export const fetchChildCells = (
  { cell },
  onData,
  onError = onErrorDefault
) => {
  const ids = cell.children.reduce((ids, child) => {
    ids.push(child.id)
    return ids;
  }, []);
  fetchCells( { ids }, onData, onError);
}