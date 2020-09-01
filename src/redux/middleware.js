import * as types from "./actionTypes";
import * as actions from "./actions";
import axios from 'axios';
import assert from 'assert';
import * as constants from '../constants';
import * as cellUtils from '../cell-utils';

const routeStem = "http://localhost:5000/api";

const setCellChildrenLogic = store => next => action => {
  if (action.type === types.SET_CELL_CHILDREN) {
    const {
      parentId,
      newChildren,
    } = action.payload;
    try {
      const children = store.getState().view.cells[parentId].children;
      assert.notDeepEqual(children, newChildren);
      next(action);
    } catch (e) { }
  } else {
    next(action);
  }
}

const fetchCellsLogic = store => next => action => {
  if (action.type === types.FETCH_CELLS) {
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
  if (action.type === types.FETCH_CHILD_CELLS) {
    try {
      const cells = store.getState().view.cells;
      const children = cells[action.payload.cellId].children;
      let ids = reduceCellsToIds(children);
      ids.push(action.payload.cellId);
      const cellList = await axios.get(`${routeStem}/cells`, {
        params: { ids }
      }).then(res => res.data)
      const newCells = mapCellList(cellList);
      next(actions.insertCells({ cells: newCells }));
    } catch (e) {
      console.log(e);
    }
  } else {
    next(action);
  }
}

const fetchChildCellsToggleExpand = store => next => async action => {
  if (action.type === types.FETCH_CHILD_CELLS_TOGGLE_EXPAND) {
    const {
      view,
      viewPath,
      cellId,
      cellVid,
      isExpanded
    } = action.payload;
    if (isExpanded) {
      next(actions.toggleCellExpand({
        view,
        viewPath,
        cellVid
      }))
    } else {
      try {
        const cells = store.getState().view.cells;
        const children = cells[cellId].children;
        let ids = reduceCellsToIds(children);
        ids.push(cellId);
        const cellList = await axios.get(`${routeStem}/cells`, {
          params: { ids }
        }).then(res => res.data)
        const newCells = mapCellList(cellList);
        next(actions.insertChildCellsToggleExpand({
          view,
          viewPath,
          cellVid,
          newCells
        }));
      } catch (e) {
        console.log(e);
      }
    }
  } else {
    next(action);
  }
}

const fetchUserInitLogic = store => next => async action => {
  if (action.type === types.FETCH_USER_INIT) {
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
          tabs: [{ id: user._id }],
          tabsView: {
            [user._id]: {}
          },
          children: []
        }
      }
      next(actions.setStore({ store }));
    } catch (e) {
      console.log(e);
    }
  } else {
    next(action);
  }
}

const patchContentToggleEditLogic = store => next => async action => {
  if (action.type === types.PATCH_CONTENT_TOGGLE_EDIT) {
    const {
      view,
      viewPath,
      cellVid,
      cellId
    } = action.payload;
    const isEditing = view.tabsView[view.currTabId]?.[cellVid]?.isEditing;
    if (isEditing) {
      const content = store.getState().view.cells[cellId].content;
      try {
        await axios.patch(`${routeStem}/cell-content`, {
          id: cellId,
          content: content
        });
        next(actions.patchContentToggleEdit({
          view,
          viewPath,
          cellVid,
          cellId,
          content
        }))
      } catch (e) {
        console.log(e);
      }
    } else {
      next(actions.toggleCellEdit({
        view,
        viewPath,
        cellVid
      }))
    }
  } else {
    next(action);
  }
}

const postNewChildCellExpandLogic = store => next => async action => {
  if (action.type === types.POST_NEW_CHILD_CELL_EXPAND) {
    const {
      view,
      viewPath,
      parentId,
      parentVid,
      insertIndex = 0
    } = action.payload;
    try {
      let childCells = {};
      const cells = store.getState().view.cells;
      const children = cells[parentId].children;
      let fetchIds = reduceCellsToIds(children);
      fetchIds.push(parentId);
      // get updated parent and children cells
      const cellList = await axios.get(`${routeStem}/cells`, {
        params: { ids: fetchIds }
      }).then(res => res.data);
      childCells = mapCellList(cellList);
      // make request to post a new cell
      const { newId, newCell } = await axios.post(`${routeStem}/new-cell`, {
        parentId,
        index: insertIndex
      }).then(res => res.data);
      // create the new cell in childCells
      childCells[newId] = { ...newCell, id: newCell._id };
      next(actions.insertNewChildCellExpand({
        view,
        viewPath,
        parentId,
        parentVid,
        newId,
        insertIndex,
        childCells
      }));
    } catch (e) {
      console.log(e);
    }
  } else {
    next(action);
  }
}

const deleteChildLogic = store => next => async action => {
  if (action.type === types.DELETE_CHILD) {
    const {
      parentId,
      childIndex,
      focusNextCell
    } = action.payload;
    try {
      const cells = store.getState().view.cells;
      const childId = cells[parentId].children[childIndex].id;
      await axios.delete(`${routeStem}/link`, {
        data: {
          parentId,
          childId
        }
      })
      next(action);
      focusNextCell();
    } catch (e) {
      console.log(e)
    }
  } else {
    next(action);
  }
}

const localStorageInitLogic = store => next => async action => {
  if (action.type === types.LOCAL_STORAGE_INIT) {
    const lsKey = constants.LOCAL_STORAGE_KEY;
    const viewTree = JSON.parse(localStorage.getItem(lsKey));
    if (viewTree) {
      // local storage exists so recreate the view
      // get required cell ids used in cached view
      const idToExpandMap = getViewIds(viewTree);
      let ids = Object.keys(idToExpandMap);
      // get updated versions of these cells
      let cellList = await axios.get(`${routeStem}/cells`, {
        params: { ids }
      }).then(res => res.data);
      let cells = mapCellList(cellList);
      // some child cells may be implicitly there if never expanded
      // so fetch these too
      ids = [];
      for (const id in idToExpandMap) {
        // get all child cell ids of this expanded cell
        if (idToExpandMap[id]) {
          ids.push(...reduceCellsToIds(cells[id].children));
        }
      }
      // fetch these potentially missing cells
      cellList = await axios.get(`${routeStem}/cells`, {
        params: { ids }
      }).then(res => res.data);
      // add them to our cell map
      for (let i = 0; i < cellList.length; i++) {
        cells[cellList[i]._id] = cellList[i];
      }
      const restoredView = recreateView(viewTree, cells);
      next(actions.setStore({
        store: {
          viewTree: restoredView,
          cells
        }
      }))
    } else {
      const email = store.getState().user.email;
      next(actions.fetchUserInit({ email }));
    }
  } else {
    next(action);
  }
}

export default [
  fetchCellsLogic,
  fetchChildCellsLogic,
  fetchUserInitLogic,
  setCellChildrenLogic,
  fetchChildCellsToggleExpand,
  patchContentToggleEditLogic,
  postNewChildCellExpandLogic,
  deleteChildLogic,
  localStorageInitLogic
];

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

// get a map of all (ids => isExpanded) in a view
const getViewIds = view => {
  let ids = {};
  for (let i = 0; i < view.tabs.length; i++) {
    ids[view.tabs[i].id] = true;
  }
  if (view.tabsView) {
    for (const id in view.tabsView) {
      ids[id] = true;
      for (const vid in view.tabsView[id]) {
        const id2 = vid.replace(/_[0-9]+$/, '');
        // if we do not have id or it is expanded then skip
        if (ids[id2]) continue;
        ids[id2] = view.tabsView[id][vid].isExpanded;
      }
    }
  }
  for (let i = 0; i < view.children.length; i++) {
    const viewIds = getViewIds(view.children[i]);
    for (const id in viewIds) {
      if (ids[id]) continue;
      ids[id] = viewIds[id];
    }
  }
  return ids;
}

// restore and clean the old saved view
const recreateView = (view, cells) => {
  let tabs = [];
  // only add available tabs
  for (let i = 0; i < view.tabs.length; i++) {
    if (cells[view.tabs[i].id]) {
      tabs.push(view.tabs[i]);
    }
  }
  // only add available cells
  let tabsView = {};
  for (const tabId in view.tabsView) {
    if (cells[tabId]) {
      tabsView[tabId] = {};
      for (const vid in view.tabsView[tabId]) {
        const id = cellUtils.cellVidToId(vid);
        if (cells[id]) {
          tabsView[tabId][vid] = view.tabsView[tabId][vid];
        }
      }
    }
  }
  // recursively do the same for all child views
  let children = [];
  for (let i = 0; i < view.children.length; i++) {
    children.push(recreateView(view.children[i], cells));
  }
  return {
    ...view,
    tabs,
    tabsView,
    children
  }
}