import update from "immutability-helper";
import { v1 as uuidv1 } from "uuid";
import {
  getUpdateAtPathOb,
  removeListItemAtPath
} from "../../tree-utils"
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
  DELETE_VIEW
} from "../actionTypes"

const initialState = {
  viewTree: {
    id: "1",
    currTabId: 0,
    tabs: [],
    tabsView: {},
    children: []
  },
  cells: {}
}

export default function(state = initialState, action) {
  switch (action.type) {
    case INSERT_NEW_CHILD_CELL: {
      const {
        view,
        viewPath,
        currTabId,
        parentId,
        parentVid,
        newId,
        insertIndex = 0,
        childCells = {},
      } = action.payload;
      // create the new cell in childCells
      childCells[newId] = { id: newId, content: "", children: [] };
      const childVid = `${newId}_1`;
      let cellViews = { [childVid]: getDefaultCellView(childVid) };
      // check if parentCellView exists
      const parentCellView = view.tabsView[currTabId]?.[parentVid];
      if(parentCellView) {
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
          [parentId]: {
            children: { $splice: [[insertIndex, 0, { id: newId }]]}
          },
          $merge: childCells
        },
        viewTree: getUpdateAtPathOb({
          treeData: state.viewTree,
          path: viewPath,
          update: getCellViewsUpdateOp({
            view,
            currTabId,
            cellViews
          })
        })
      }
      return update(state, updateOp);
    }
		case SET_CELL_CONTENT: {
			const { cellId, content } = action.playload;
			return update(state, {
				cells: {
					[cellId]: {
						content: { $set: content }
					}
				}
			});
    }
    case TOGGLE_CELL_EXPAND: {
      const {
        view,
        viewPath,
        currTabId,
        vid
      } = action.payload;
      const updateOp = {
        viewTree: getUpdateAtPathOb({
          treeData: state.viewTree,
          path: viewPath,
          update: getToggleCellViewAttrUpdateOp({
            view,
            currTabId,
            vid,
            attrKey: "isExpanded"
          })
        })
      }
      return update(state, updateOp);
    }
    case TOGGLE_CELL_EDIT: {
      const {
        view,
        viewPath,
        currTabId,
        vid
      } = action.payload;
      const updateOp = {
        viewTree: getUpdateAtPathOb({
          treeData: state.viewTree,
          path: viewPath,
          update: getToggleCellViewAttrUpdateOp({
            view,
            currTabId,
            vid,
            attrKey: "isEditing"
          })
        })
      }
      return update(state, updateOp);
    }
    case ADD_TAB: {
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
    case CLOSE_TAB: {
      const {
        view,
        viewPath,
        tabId,
        tabIndex
      } = action.payload;
      const isCurrTab = view.currTabId === tabId;
      let newCurrTabId = view.currTabId;
      if(isCurrTab) {
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
    case SPLIT_VIEW: {
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
    case CHANGE_TAB: {
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
    case SET_TABS: {
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
    case SET_CELL_CHILDREN: {
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
    case SET_STORE: {
      const {
        store
      } = action.payload;
      const updateOp = {
        $set: store
      }
      return update(state, updateOp);
    }
    case SET_TAB_VIEW: {
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
    case DELETE_VIEW: {
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
    default: {
      return state;
    }
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
	currTabId,
	vid,
	attrKey
}) => {
	let cellView = {};
	const oldCellView = view.tabsView[currTabId]?.[vid];
	if(oldCellView) {
		cellView = {
			[vid]: {
				...oldCellView,
				[attrKey]: !oldCellView[attrKey]
			}
		}
	} else {
		// if the cellView does not exist yet then assume all its boolean props are set to false
		cellView = {
			[vid]: {
				...getDefaultCellView(vid),
				[attrKey]: true
			}
		}
	}
	return (
		getCellViewsUpdateOp({
			view,
			currTabId,
			cellView
		})
	)
}

const getCellViewsUpdateOp = ({
  view,
  currTabId,
  cellViews
}) => {
	let update = {
		tabsView: {}
	}
	// case when view.tabsView[currTabId] exists
	if(view.tabsView[currTabId]) {
		update.tabsView = {
			[currTabId]: {
				$merge: cellViews
			}
		}
	} else {
		// case when view.tabsView[currTabId] does not exist
		update.tabsView = {
			$merge: {
				[currTabId]: cellViews
			}
		}
  }
  return update;
}