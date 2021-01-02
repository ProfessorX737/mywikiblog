import store from './redux/store';
import * as actions from './redux/actions';

export const makeCellVid = ({ cellId, count }) => {
  return `${cellId}_${count}`;
}

export const cellVidToId = cellVid => {
  return cellVid.replace(/_[0-9]+$/, '');
}

export const getCellVidList = ({
  cellId,
  cells,
  getIsExpanded,
  idCount = {},
  isRoot = true
}) => {
  let count = idCount[cellId];
  count = Boolean(count) ? count + 1 : 1;
  idCount[cellId] = count;
  const cellVid = makeCellVid({ cellId, count });
  let keys = isRoot ? [] : [cellVid];
  if (isRoot || getIsExpanded(cellVid)) {
    const children = cells[cellId].children;
    for (let i = 0; i < children.length; i++) {
      keys.push(...getCellVidList({
        cellId: children[i].id,
        cells,
        getIsExpanded,
        idCount,
        isRoot: false
      }));
    }
  }
  return keys;
};

export const handleDragStart = evt => {
  store.dispatch(actions.setShowScaffolding({ show: true }));
}

export const handleDragEnd = evt => {
  store.dispatch(actions.setShowScaffolding({ show: false }));
}