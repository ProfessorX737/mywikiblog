import update from "immutability-helper";
import {
	updateAtPath,
	getValAtPath
} from "../../tree-utils"
import {
	TOGGLE_CELL_EXPAND,
	TOGGLE_CELL_EDIT,
} from "../actionTypes"

const initialState = {
	id: "1",
	currTabId: 0,
	tabs: [],
	tabsView: {},
	children: []
}

const getDefaultCellView = (vid) => {
	return {
		vid,
		isEditing: false,
		isExpanded: false
	}
}

/**
 * Set cell view attribute
 * @param {Object} params 
 * @param {Object} params.view - the view object as shortcut to deriving it from viewTree using viewPath
 * @param {(number|string)[]} viewPath - path to the view object as an array of keys
 * @param {string} currTabId - current tab id is the id of a cell found at view.tabsView[currTabId] if exists
 * @param {string} vid - cell view id of the cell of form `${id}_${count}`
 * @param {string} attrKey - key of the property in the cell view to change
 * @param {(string|number|boolean)} newAttrVal - the new value to set
 */
const setCellViewAttr = ({
	view,
	viewTree,
	viewPath,
	currTabId,
	vid,
	attrKey,
	newAttrVal
}) => {
	// if(!view) {
	// 	view = getValAtPath({
	// 		treeData: state.viewTree,
	// 		path: viewPath
	// 	})
	// }
	let update = {
		tabsView: {}
	}
	// case when view.tabsView[currTabId] exists
	if(view.tabsView[currTabId]) {
		// case when [currTabId][vid] exists
		if(view.tabsView[currTabId][vid]) {
			update.tabsView = {
				[currTabId]: {
					[vid]: {
						[attrKey]: {
							$set: newAttrVal
						}
					}
				}
			}
		} else {
			// case when view.tabsView[currTabId][vid] does not exist
			update.tabsView = {
				[currTabId]: {
					$merge: {
						[vid]: {
							...getDefaultCellView(vid),
							[attrKey]: newAttrVal
						}
					}
				}
			}
		}
	} else {
		// case when view.tabsView[currTabId] does not exist
		update.tabsView = {
			$merge: {
				[currTabId]: {
					[vid]: {
							...getDefaultCellView(vid),
							[attrKey]: newAttrVal
					}
				}
			}
		}
	}
	return (
		updateAtPath({
			treeData: viewTree,
			path: viewPath,
			update
		})
	)
}

const toggleCellViewAttr = ({
	view,
	viewTree,
	viewPath,
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
		setCellViews({
			view,
			viewTree,
			viewPath,
			currTabId,
			cellView
		})
	)
}

/**
 * Set cell view attribute
 * @param {Object} params 
 * @param {Object} params.view - the view object as shortcut to deriving it from viewTree using viewPath
 * @param {(number|string)[]} viewPath - path to the view object as an array of keys
 * @param {string} currTabId - current tab id is the id of a cell found at view.tabsView[currTabId] if exists
 * @param {cellViews} cellViews - object of form {..., vid: { ...cellView }, ... }
 */
const setCellViews = ({
	view,
	viewTree,
	viewPath,
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
	return (
		updateAtPath({
			treeData: viewTree,
			path: viewPath,
			update
		})
	)
}

export default function(state = initialState, action) {
	switch (action.type) {
		case TOGGLE_CELL_EXPAND: {
			const {
				view,
				viewPath,
				currTabId,
				vid
			} = action.payload;
			return toggleCellViewAttr({
				view,
				viewTree: state.viewTree,
				viewPath,
				currTabId,
				vid,
				attrKey: "isExpanded",
			})
		}
		case TOGGLE_CELL_EDIT: {
			const {
				view,
				viewPath,
				currTabId,
				vid
			} = action.payload;
			return toggleCellViewAttr({
				view,
				viewTree: state.viewTree,
				viewPath,
				currTabId,
				vid,
				attrKey: "isEditing",
			})
		}
		case INSERT_CELL_VIEWS: {
			const {
				viewPath,
				currTabId,
				cellViews
			} = action.payload;
			const tabView = getValAtPath({
				treeData: state.viewTree,
				path: [...viewPath, "tabsView", currTabId]
			});
      // the currTabView object exists so just add the new cellView to it
			if(tabView) {
				return (
					updateAtPath({
						treeData: state.viewTree,
						path: viewPath,
						update: {
							"tabsView": {
								[currTabId]: {
									$merge: cellViews
								}
							}
						}
					})
				)
			} else {
			// the currTabView object does not exist so create it with the
      // single cellView and add it to tabsView object
				return (
					updateAtPath({
						treeData: state.viewTree,
						path: viewPath,
						update: {
							"tabsView": {
								$merge: {
									[currTabId]: cellViews
								}
							}
						}
					})
				)
			}
		}
		case ADD_TAB_VIEW: {
			const {
				viewPath,
				tabView
			} = action.payload;
			return (
				updateAtPath({
					treeData: state.viewTree,
					path: viewPath,
					update: {
						"tabsView": {
							$merge: tabView
						}
					}
				})
			)
		}
		case SET_CURRENT_TAB_ID: {
			const {
				viewPath,
				tabId
			} = action.payload;
			return (
				updateAtPath({
					treeData: state.viewTree,
					path: viewPath,
					update: {
						currTabId: {
							$set: tabId
						}
					}
				})
			);
		}
		case CLOSE_CURRENT_TAB: {
			const {
				viewPath,
				currTabIndex,
				newCurrTabId	
			} = action.payload;
			return (
				updateAtPath({
					treeData: state.viewTree,
					path: viewPath,
					update: {
						tabs: {
							$splice: [[currTabIndex, 1]]
						},
						currTabId: {
							$set: newCurrTabId
						}
					}
				})
			);
		}
		case CLOSE_TAB: {
			const {
				viewPath,
				tabIndex
			} = action.payload;
			return (
				updateAtPath({
					treeData: state.viewTree,
					path: viewPath,
					update: {
						tabs: {
							$splice: [[tabIndex, 1]]
						}
					}
				})
			);
		}
		
	}
}