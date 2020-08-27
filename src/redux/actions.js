import * as types from "./actionTypes"

export function insertNewChildCell({
  view,
  viewPath,
  parentId,
  parentVid,
  newId,
  insertIndex = 0,
  childCells = {},
}) {
  return ({
    type: types.INSERT_NEW_CHILD_CELL,
    payload: arguments[0]
  })
}

export function insertCells({
  cells,
}) {
  return ({
    type: types.INSERT_CELLS,
    payload: arguments[0]
  })
}

export function setCellContent({
  cellId, content
}) {
  return ({
    type: types.SET_CELL_CONTENT,
    payload: arguments[0]
  })
}

export function toggleCellExpand({
  view,
  viewPath,
  cellVid
}) {
  return ({
    type: types.TOGGLE_CELL_EXPAND,
    payload: arguments[0]
  })
}

export function toggleCellEdit({
  view,
  viewPath,
  cellVid
}) {
  return ({
    type: types.TOGGLE_CELL_EDIT,
    payload: arguments[0]
  })
}

export function addTab({
  viewPath,
  tabId
}) {
  return ({
    type: types.ADD_TAB,
    payload: arguments[0]
  })
}

export function closeTab({
  view,
  viewPath,
  tabId,
  tabIndex
}) {
  return ({
    type: types.CLOSE_TAB,
    payload: arguments[0]
  })
}

export function splitView({
  view,
  viewPath,
  direction,
}) {
  return ({
    type: types.SPLIT_VIEW,
    payload: arguments[0]
  })
}

export function changeTab({
  viewPath,
  tabId
}) {
  return ({
    type: types.CHANGE_TAB,
    payload: arguments[0]
  })
}

export function setTabs({
  viewPath,
  newTabs
}) {
  return ({
    type: types.SET_TABS,
    payload: arguments[0]
  })
}

export function setCellChildren({
  parentId,
  newChildren
}) {
  return ({
    type: types.SET_CELL_CHILDREN,
    payload: arguments[0]
  })
}

export function setStore({
  store
}) {
  return ({
    type: types.SET_STORE,
    payload: arguments[0]
  })
}

export function setTabView({
  viewPath,
  tabView
}) {
  return ({
    type: types.SET_TAB_VIEW,
    payload: arguments[0]
  });
}

export function deleteView({
  viewPath
}) {
  return ({
    type: types.DELETE_VIEW,
    payload: arguments[0]
  });
}

export function fetchCells({
  cellIds
}) {
  return ({
    type: types.FETCH_CELLS,
    payload: arguments[0]
  })
}

export function fetchChildCells({
  cellId
}) {
  return ({
    type: types.FETCH_CHILD_CELLS,
    payload: arguments[0]
  })
}

export function fetchUserInit({
  email
}) {
  return ({
    type: types.FETCH_USER_INIT,
    payload: arguments[0]
  })
}

export function fetchChildrenExpand({
  cellId
}) {
  return ({
    type: types.FETCH_CHILDREN_EXPAND,
    payload: arguments[0]
  })
}