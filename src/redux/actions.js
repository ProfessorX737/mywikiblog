import {
  INSERT_NEW_CHILD_CELL,
  SET_CELL_CONTENT,
  TOGGLE_CELL_EXPAND,
  TOGGLE_CELL_EDIT,
  ADD_TAB,
  CLOSE_TAB,
  SPLIT_VIEW,
  CHANGE_TAB,
  SET_TABS,
  SET_CELL_CHILDREN,
  SET_STORE,
  SET_TAB_VIEW,
  DELETE_VIEW,
} from "./actionTypes"

export function insertNewChildCell({
  view,
  viewPath,
  currTabId,
  parentId,
  parentVid,
  newId,
  insertIndex = 0,
  childCells = {},
}) {
  return ({
    type: INSERT_NEW_CHILD_CELL,
    payload: arguments[0]
  })
}

export function setCellContent({
  cellId, content
}) {
  return ({
    type: SET_CELL_CONTENT,
    payload: arguments[0]
  })
}

export function toggleCellExpand({
  view,
  viewPath,
  currTabId,
  vid
}) {
  return ({
    type: TOGGLE_CELL_EXPAND,
    payload: arguments[0]
  })
}

export function toggleCellEdit({
  view,
  viewPath,
  currTabId,
  vid
}) {
  return ({
    type: TOGGLE_CELL_EDIT,
    payload: arguments[0]
  })
}

export function addTab({
  viewPath,
  tabId
}) {
  return ({
    type: ADD_TAB,
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
    type: CLOSE_TAB,
    payload: arguments[0]
  })
}

export function splitView({
  view,
  viewPath,
  direction,
}) {
  return ({
    type: SPLIT_VIEW,
    payload: arguments[0]
  })
}

export function changeTab({
  viewPath,
  tabId
}) {
  return ({
    type: CHANGE_TAB,
    payload: arguments[0]
  })
}

export function setTabs({
  viewPath,
  newTabs
}) {
  return ({
    type: SET_TABS,
    payload: arguments[0]
  })
}

export function setCellChildren({
  parentId,
  newChildren
}) {
  return ({
    type: SET_CELL_CHILDREN,
    payload: arguments[0]
  })
}

export function setStore({
  store
}) {
  return ({
    type: SET_STORE,
    payload: arguments[0]
  })
}

export function setTabView({
  viewPath,
  tabView
}) {
  return ({
    type: SET_TAB_VIEW,
    payload: arguments[0]
  });
}

export function deleteView({
  viewPath,
}) {
  return ({
    type: DELETE_VIEW,
    payload: arguments[0]
  });
}