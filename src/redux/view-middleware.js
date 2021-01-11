import * as types from "./actionTypes";
import * as actions from "./actions";
import axios from '../common/api-client';
import assert from 'assert';
import * as cellUtils from '../pages/articles-viewer/cell-utils';
import * as treeUtils from '../pages/articles-viewer/tree-utils';
import * as storage from '../common/localStorage';
import { routeStem } from '../constants/routes';
import history from '../common/history';

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
      // expand cell first then fetch
      next(actions.toggleCellExpand({ view, viewPath, cellVid }));
      try {
        const cells = store.getState().view.cells;
        const children = cells[cellId].children;
        let ids = reduceCellsToIds(children);
        ids.push(cellId);
        const cellList = await axios.get(`${routeStem}/cells`, {
          params: { ids }
        }).then(res => res.data)
        const newCells = mapCellList(cellList);
        next(actions.insertCells({ cells: newCells }));
      } catch (e) {
        console.log(e);
        // collapse cell if error occured
        next(actions.toggleCellExpand({ view, viewPath, cellVid }));
      }
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
      try {
        // check if the user is authenticated before allowing them to edit
        await axios.get(`${routeStem}/is-auth`);
        next(actions.toggleCellEdit({
          view,
          viewPath,
          cellVid
        }))
      } catch (e) {
        console.log(e);
      }
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
    const match = history.location.pathname.match(/\/article\/(\w+)\/?$/);
    try {
      const viewTree = storage.getView();
      if (viewTree) {
        // local storage exists so recreate the view
        // get required cell ids used in cached view
        const idToExpandMap = getViewIds(viewTree);
        let ids = Object.keys(idToExpandMap);
        // if the url requests for a specific cell then add it in as well
        if(match) ids.push(match[1]);
        // get updated versions of these cells
        let cellList = await axios.get(`${routeStem}/cells`, {
          params: { ids }
        }).then(res => res.data);
        let cells = mapCellList(cellList);
        // some child cells may be implicitly there if never expanded since these are 
        // by default collapsed so fetch these too. We can't do it all in one go because
        // the cells from before might have new child cells.
        ids = [];
        for (const id in idToExpandMap) {
          // get all child cell ids of this expanded cell
          if(cells[id]) {
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
        // Add the url requested cell to the first view's tabs if not already there
        // and set it as the curr tab
        if(match && cells[match[1]]) {
          const firstView = treeUtils.getValAtPath({
            treeData: restoredView,
            path: treeUtils.getFirstViewPath(restoredView)
          });
          if(firstView.tabs.find(({ id }) => id === match[1]) === undefined) {
            firstView.tabs.push({ id: match[1] });
          }
          firstView.currTabId = match[1];
        }
        next(actions.setStore({
          store: {
            viewTree: restoredView,
            cells
          }
        }))
      } else {
        const email = store.getState().user.email;
        const user = await axios.get(`${routeStem}/user`, {
          params: { email }
        }).then(res => res.data);
        const cells = { [user._id]: user };
        const tabs = [{id: user._id}];
        let currTabId = user._id;
        const tabsView = { [user._id]: {} };
        // If the url requests a specific cell id then fetch it
        if(match) {
          try {
            const cell = await axios.get(`${routeStem}/cell`, {
              params: { id: match[1] }
            }).then(res => res.data);
            cells[cell._id] = cell;
            tabs.push({id: cell._id});
            currTabId = cell._id;
            tabsView[cell._id] = {};
          } catch(e) {
            console.log("Could not find requested cell id: " + match[1]);
          }
        }
        const initStore = {
          cells,
          viewTree: {
            id: "1",
            currTabId,
            tabs,
            tabsView,
            children: []
          }
        }
        console.log(initStore);
        next(actions.setStore({ store: initStore }));
      }
    } catch (e) {
      console.log(e);
    }
  } else {
    next(action);
  }
}

const dragAndDropCellEffectLogic = store => next => async action => {
  if (action.type === types.DRAG_AND_DROP_CELL_EFFECT) {
    const {
      oldParentId,
      newParentId,
      childOldIndex,
      childNewIndex,
    } = action.payload;
    try {
      const cells = store.getState().view.cells;
      const childId = cells[newParentId].children[childNewIndex].id;
      if(oldParentId === newParentId) {
        // move the cell
        await axios.patch(`${routeStem}/relink-cell`, {
          oldParentId,
          newParentId,
          childId,
          index: childNewIndex
        })
      } else {
        // link the cell
        await axios.patch(`${routeStem}/link-cell`, {
          parentId: newParentId,
          childId,
          index: childNewIndex
        })
      }
    } catch (e) {
      // undo the drag and drop operation
      console.log(e);
      if(oldParentId === newParentId) {
        next(actions.moveChildCell({
          toParentId: oldParentId,
          fromParentId: newParentId,
          fromIndex: childNewIndex,
          toIndex: childOldIndex
        }));
      } else {
        // since when dragging between articles we just 'copy' the cell we just want
        // to delete the new copy at the new location
        next(actions.deleteChild({
          parentId: newParentId,
          childIndex: childNewIndex
        }))
      }
    }
  } else {
    next(action);
  }
}

const addTabLogic = store => next => async action => {
  if(action.type === types.ADD_TAB) {
    const { viewPath, tabsId } = action.payload;
    //viewPath.push('tabs');
    console.log(viewPath);
    const tabs = treeUtils.getValAtPath({ treeData: store.getState().view.viewTree, path: viewPath });
    console.log(tabs);
  } else {
    next(action);
  }
}

export default [
  fetchCellsLogic,
  fetchChildCellsLogic,
  setCellChildrenLogic,
  fetchChildCellsToggleExpand,
  patchContentToggleEditLogic,
  postNewChildCellExpandLogic,
  deleteChildLogic,
  localStorageInitLogic,
  dragAndDropCellEffectLogic,
  addTabLogic,
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