import update from "immutability-helper";
import { v1 as uuidv1 } from "uuid";
import {
  getUpdateAtPathOb,
  removeListItemAtPath
} from "../../pages/articles-viewer/tree-utils"
import * as types from "../actionTypes"

const initialState = {
  viewTree: {
    id: "1",
    currTabId: 0,
    tabs: [],
    tabsView: {},
    children: []
  },
  cells: {},
  showScaffolding: false,
}

export default function (state = initialState, action) {
  switch (action.type) {
    case types.INSERT_NEW_CHILD_CELL_EXPAND: {
      const {
        view,
        viewPath,
        parentId,
        parentVid,
        newId,
        insertIndex = 0,
        childCells,
      } = action.payload;
      const childVid = `${newId}_1`;
      let cellViews = { [childVid]: getDefaultCellView(childVid) };
      // check if parentCellView exists
      const parentCellView = view.tabsView[view.currTabId]?.[parentVid];
      if (parentCellView) {
        cellViews[parentVid] = {
          ...parentCellView,
          isExpanded: true
        }
      } else {
        // parentCellView does not exist so make one
        cellViews[parentVid] = {
          ...getDefaultCellView(parentVid),
          isExpanded: true
        }
      }
      // cellViews has new parent and child cell views now
      // so now we create the whole update object
      let updateOp = {
        cells: {
          $merge: update(childCells, {
            [parentId]: {
              children: { $splice: [[insertIndex, 0, { id: newId }]] }
            }
          })
        },
        viewTree: getUpdateAtPathOb({
          treeData: state.viewTree,
          path: viewPath,
          update: getCellViewsUpdateOp({
            view,
            cellViews
          })
        })
      }
      return update(state, updateOp)
    }
    case types.INSERT_CELLS: {
      const {
        cells
      } = action.payload;
      return update(state, {
        cells: {
          $merge: cells
        }
      })
    }
    case types.SET_CELL_CONTENT: {
      const { cellId, content } = action.payload;
      return update(state, {
        cells: {
          [cellId]: {
            content: { $set: content }
          }
        }
      });
    }
    case types.TOGGLE_CELL_EXPAND: {
      const {
        view,
        viewPath,
        cellVid
      } = action.payload;
      const updateOp = {
        viewTree: getUpdateAtPathOb({
          treeData: state.viewTree,
          path: viewPath,
          update: getToggleCellViewAttrUpdateOp({
            view,
            cellVid,
            attrKey: "isExpanded"
          })
        })
      }
      return update(state, updateOp);
    }
    case types.TOGGLE_CELL_EDIT: {
      const {
        view,
        viewPath,
        cellVid,
      } = action.payload;
      const updateOp = {
        viewTree: getUpdateAtPathOb({
          treeData: state.viewTree,
          path: viewPath,
          update: getToggleCellViewAttrUpdateOp({
            view,
            cellVid,
            attrKey: "isEditing"
          })
        })
      }
      return update(state, updateOp);
    }
    case types.ADD_TAB: {
      const {
        viewPath,
        tabId
      } = action.payload;
      const updateOp = {
        viewTree: getUpdateAtPathOb({
          treeData: state.viewTree,
          path: viewPath,
          update: {
            tabs: {
              $push: [{ id: tabId }]
            },
            currTabId: {
              $set: tabId
            }
          }
        })
      }
      return update(state, updateOp);
    }
    case types.CLOSE_TAB: {
      const {
        view,
        viewPath,
        tabId,
        tabIndex
      } = action.payload;
      const isCurrTab = view.currTabId === tabId;
      let newCurrTabId = view.currTabId;
      if (isCurrTab) {
        const inc = tabIndex === view.tabs.length - 1 ? -1 : 1;
        newCurrTabId = view.tabs[tabIndex + inc]?.id || 0;
      }
      const updateOp = {
        viewTree: getUpdateAtPathOb({
          treeData: state.viewTree,
          path: viewPath,
          update: {
            tabs: {
              $splice: [[tabIndex, 1]]
            },
            currTabId: { $set: newCurrTabId }
          }
        })
      }
      return update(state, updateOp);
    }
    case types.SPLIT_VIEW: {
      const {
        view,
        viewPath,
        direction,
      } = action.payload;
      const newView = {
        id: view.id,
        flexFlow: direction,
        tabs: [],
        tabsView: {},
        children: [
          { ...update(view, {}), id: uuidv1() },
          {
            ...initialState.viewTree,
            id: uuidv1()
          }
        ]
      }
      const updateOp = {
        viewTree: getUpdateAtPathOb({
          treeData: state.viewTree,
          path: viewPath,
          update: {
            $set: newView
          }
        })
      }
      return update(state, updateOp);
    }
    case types.CHANGE_TAB: {
      const {
        viewPath,
        tabId
      } = action.payload;
      const updateOp = {
        viewTree: getUpdateAtPathOb({
          treeData: state.viewTree,
          path: viewPath,
          update: {
            currTabId: {
              $set: tabId
            }
          }
        })
      }
      return update(state, updateOp);
    }
    case types.SET_TABS: {
      const {
        viewPath,
        newTabs
      } = action.payload;
      const updateOp = {
        viewTree: getUpdateAtPathOb({
          treeData: state.viewTree,
          path: viewPath,
          update: {
            tabs: {
              $set: newTabs
            }
          }
        })
      }
      return update(state, updateOp)
    }
    case types.SET_CELL_CHILDREN: {
      const {
        parentId,
        newChildren
      } = action.payload;
      const updateOp = {
        cells: {
          [parentId]: {
            children: {
              $set: newChildren
            }
          }
        }
      }
      return update(state, updateOp);
    }
    case types.SET_STORE: {
      const {
        store
      } = action.payload;
      const updateOp = {
        $set: store
      }
      return update(state, updateOp);
    }
    case types.SET_TAB_VIEW: {
      const {
        viewPath,
        tabView
      } = action.payload;
      const updateOp = {
        viewTree: getUpdateAtPathOb({
          treeData: state.viewTree,
          path: viewPath,
          update: {
            tabsView: {
              $merge: tabView
            }
          }
        })
      }
      return update(state, updateOp);
    }
    case types.DELETE_VIEW: {
      const {
        viewPath
      } = action.payload;
      let newViewTree = removeListItemAtPath({
        treeData: state.viewTree,
        path: viewPath
      })
      newViewTree = simplifyView(newViewTree);
      return {
        ...state,
        viewTree: newViewTree
      };
    }
    case types.INSERT_CHILD_CELLS_TOGGLE_EXPAND: {
      const {
        view,
        viewPath,
        cellVid,
        newCells
      } = action.payload;
      const updateOb = {
        cells: {
          $merge: newCells
        },
        viewTree: getUpdateAtPathOb({
          treeData: state.viewTree,
          path: viewPath,
          update: getToggleCellViewAttrUpdateOp({
            view,
            cellVid,
            attrKey: "isExpanded"
          })
        })
      }
      return update(state, updateOb);
    }
    case types.PATCH_CONTENT_TOGGLE_EDIT: {
      const {
        view,
        viewPath,
        cellVid,
        cellId,
        content
      } = action.payload;
      const updateOb = {
        cells: {
          [cellId]: {
            content: {
              $set: content
            }
          }
        },
        viewTree: getUpdateAtPathOb({
          treeData: state.viewTree,
          path: viewPath,
          update: getToggleCellViewAttrUpdateOp({
            view,
            cellVid,
            attrKey: "isEditing"
          })
        })
      }
      return update(state, updateOb);
    }
    case types.DELETE_CHILD: {
      const {
        parentId,
        childIndex
      } = action.payload;
      const childId = state.cells[parentId].children[childIndex].id;
      // create copy of the view and delete all tabs with id = childId
      let viewTree = update(state.viewTree, {});
      mutateDeleteTabId(viewTree, childId);
      const updateOb = {
        cells: {
          [parentId]: {
            children: {
              $splice: [[childIndex, 1]]
            }
          }
        },
        viewTree: {
          $set: viewTree
        }
      }
      return update(state, updateOb);
    }
    case types.MOVE_CHILD_CELL: {
      const {
        toParentId,
        fromParentId,
        fromIndex,
        toIndex,
      } = action.payload;
      const childId = state.cells[fromParentId].children[fromIndex].id;
      const updateOb1 = {
        cells: {
          [fromParentId]: {
            children: {
              $splice: [[fromIndex, 1]]
            }
          },
        }
      }
      const updateOb2 = {
        cells: {
          [toParentId]: {
            children: {
              $splice: [[toIndex, 0, { id: childId }]]
            }
          },
        }
      }
      return update(update(state, updateOb1), updateOb2);
    }
    case types.SHOW_SCAFFOLDING: {
      const { show } = action.payload;
      return update(state, { showScaffolding: { $set: show } });
    }
    default: {
      return state;
    }
  }
}

const mutateDeleteTabId = (view, id) => {
  for (let i = 0; i < view.tabs.length; i++) {
    if (view.tabs[i].id === id) {
      view.tabs.splice(i, 1);
      break;
    }
  }
  for (let i = 0; i < view.children.length; i++) {
    mutateDeleteTabId(view.children[i], id);
  }
}

const simplifyView = view => {
  if (view.children.length === 1) {
    view = view.children[0];
  }
  for (let i = 0; i < view.children.length; i++) {
    view.children[i] = simplifyView(view.children[i]);
  }
  return view;
};

const getDefaultCellView = (vid) => {
  return {
    vid,
    isEditing: false,
    isExpanded: false
  }
}

const getToggleCellViewAttrUpdateOp = ({
  view,
  cellVid,
  attrKey
}) => {
  let cellViews = {};
  const oldCellView = view.tabsView[view.currTabId]?.[cellVid];
  if (oldCellView) {
    cellViews = {
      [cellVid]: {
        ...oldCellView,
        [attrKey]: !oldCellView[attrKey]
      }
    }
  } else {
    // if the cellView does not exist yet then assume all its boolean props are set to false
    cellViews = {
      [cellVid]: {
        ...getDefaultCellView(cellVid),
        [attrKey]: true
      }
    }
  }
  return (
    getCellViewsUpdateOp({
      view,
      cellViews
    })
  )
}

const getCellViewsUpdateOp = ({
  view,
  cellViews
}) => {
  let update = {
    tabsView: {}
  }
  // case types.when view.tabsView[currTabId] exists
  if (view.tabsView[view.currTabId]) {
    update.tabsView = {
      [view.currTabId]: {
        $merge: cellViews
      }
    }
  } else {
    // case types.when view.tabsView[currTabId] does not exist
    update.tabsView = {
      $merge: {
        [view.currTabId]: cellViews
      }
    }
  }
  return update;
}