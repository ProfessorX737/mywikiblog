import axios from 'axios';
import * as types from './actionTypes'
import { createLogic, createLogicMiddleware } from 'redux-logic';
import { insertCells } from './actions';

const routeStem = "http://localhost:5000/api";

const fetchCellsLogic = createLogic({
  type: types.FETCH_CELLS,
  latest: true,
  async process({ action }, dispatch, done) {
    const cellsList = await axios.get(`${routeStem}/cells`, {
      params: { ids: action.payload.ids }
    }).then(resp => resp.data);
    const cells = {};
    cellsList.forEach(cell => {
      cells[cell._id] = { ...cell, id: cell._id }
    })
    dispatch(insertCells({cells}));
    done();
  }
})

export default createLogicMiddleware([fetchCellsLogic])