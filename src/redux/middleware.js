import * as types from "./actionTypes";
import * as actions from "./actions";
import axios from 'axios';
const routeStem = "http://localhost:5000/api";


const fetchCellsLogic = store => next => action => {
  if(action.type === types.FETCH_CELLS) {
    axios.get(`${routeStem}/cells`, {
      params: { ids: action.payload.cellIds }
    })
    .then(res => res.data)
    .then(cellList => {
      const newCells = mapCellList(cellList);
      next(actions.insertCells({ cells: newCells }));
    })
    .catch(error => {
      console.log(error);
    })
  } else {
    next(action);
  }
}

const fetchChildCellsLogic = store => next => async action => {
  if(action.type === types.FETCH_CHILD_CELLS) {
    try {
      const cells = store.getState().cells;
      const children = cells[action.payload.cellId].children;
      const ids = reduceCellsToIds(children);
      const cellList = await axios.get(`${routeStem}/cells`, {
        params: { ids }
      }).then(res => res.data)
      const newCells = mapCellList(cellList);
      next(actions.insertCells({ cells: newCells }));
    } catch(e) {
      console.log(e);
    }
  } else {
    next(action);
  }
}

const fetchUserInitLogic = store => next => async action => {
  if(action.type === types.FETCH_USER_INIT) {
    try {
      const user = await axios.get(`${routeStem}/user`, {
        params: { email: action.payload.email }
      }).then(res => res.data);
      const store = {
        cells: {
          [user._id]: { ...user, id: user._id }
        },
        viewTree: {
          id: "1",
          currTabId: user._id,
          tabs: [{id: user._id}],
          tabsView: {
            [user._id]: {}
          },
          children: []
        }
      }
      next(actions.setStore({ store }));
    } catch(e) {
      console.log(e);
    }
  } else {
    next(action);
  }
} 

export default [fetchCellsLogic, fetchChildCellsLogic, fetchUserInitLogic];

const mapCellList = cellList => {
  let cells = {};
  cellList.forEach(cell => {
    cells[cell._id] = { ...cell, id: cell._id }
  })
  return cells;
}

const reduceCellsToIds = cells => {
  return cells.reduce((ids, cell) => {
    ids.push(cell.id)
    return ids;
  }, []);
}