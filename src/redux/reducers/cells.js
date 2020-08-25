import update from "immutability-helper";
import {
	LINK_INSERT_CELLS,
	DELETE_CHILD_CELL,
	INSERT_CELLS,
	SET_CHILD_CELLS,
	SET_CELL_CONTENT,
} from "../actionTypes"

const initialState = {};

export default function(state = initialState, action) {
	switch (action.type) {
		// merge @newCells object with state.cells and
		// insert cell with @newId into children at @insertIndex
		// of cell @parentId
		case LINK_INSERT_CELLS: {
			const {
				parentId,
				insertIndex,
				newId,
				newCells
			} = action.payload;
			return update(state, {
				cells: {
					[parentId]: {
						children: {
							$splice: [[insertIndex, 0, {id: newId}]]
						}
					},
					$merge: newCells
				}
			});
		}
		case DELETE_CHILD_CELL: {
			const { parentId, deleteIndex } = action.payload;
			return update(state, {
				cells: {
					[parentId]: {
						children: { $splice: [[deleteIndex,1]]}
					}
				}
			});
		}
		case INSERT_CELLS: {
			const { newCells } = action.payload;
			return update(state, {
				cells: {
					$merge: newCells
				}
			});
		}
		case SET_CHILD_CELLS: {
			const { parentId, children } = action.payload;
			return update(state, {
				cells: {
				   [parentId]: {
					   children: { $set: children }
				   }
				}
			});
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
		default: {
			return state;
		}
	}
}