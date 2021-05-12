import React from "react"
import PropTypes from 'prop-types'
import { connect } from "react-redux"
import { ReactSortable } from "react-sortablejs";
import "./cell-tree.css"
import clsx from 'clsx'
import {
  setCellChildren,
  dragAndDropCellEffect
} from "../../redux/actions";
import * as cellUtils from './cell-utils'
import store from '../../redux/store';

// ReactSortable.prototype.onChoose = function (evt) { };
// ReactSortable.prototype.onUnchoose = function (evt) { };

const dragGroup = () => ({
  name: "cells",
  put: (to, from, el) => {
    const toChilds = store.getState().view.cells[to.options.cellId].children;
    // If the target article already contains a cell with the same id don't add it
    const cellId = el.getAttribute("cellid");
    for (let i = 0; i < toChilds.length; i++) {
      if (toChilds[i].id === cellId) return false;
    }
    return true;
  },
  // pull: "clone"
  pull: (to, from, el) => {
    // if dragging between cells between different views then clone
    // if (to.options.viewId !== from.options.viewId) {
    //   return "clone";
    // }
    // if dragging between two different lists then clone
    if (to.options.cellId !== from.options.cellId) {
      return "clone";
    }
    // if dragging between cells within the same view then move the cells
    return true;
  }
})

class CellTree extends React.Component {
  constructor(props) {
    super(props)
    this.cellIndex = 0;
    this.cellIdCount = {};
  }

  componentDidUpdate() {
    this.cellIndex = 0;
    this.cellIdCount = {};
  }

  countCellId = cellId => {
    let count = this.cellIdCount[cellId];
    count = count ? count + 1 : 1;
    this.cellIdCount[cellId] = count;
    return count;
  }

  getCellIdCount = cellId => {
    const count = this.cellIdCount[cellId];
    return count ? count + 1 : 1;
  }

  handleSort = evt => {
    // only allow drag and drop cell effect if dragging between cell divs
    if (evt.srcElement !== evt.from) return;
    const cellClassName = evt.from.getAttribute('class').split(/\s*/)[0];
    if (!evt.to.getAttribute('class').match(cellClassName)) return;
    this.props.dragAndDropCellEffect({
      oldParentId: cellUtils.cellVidToId(evt.from.id),
      newParentId: cellUtils.cellVidToId(evt.to.id),
      childOldIndex: evt.oldIndex,
      childNewIndex: evt.newIndex,
    });
  }

  render() {
    return (
      <CellTreeRecurse
        isRoot={true}
        cellId={this.props.view.currTabId}
        renderCell={this.props.renderCell}
        view={this.props.view}
        cells={this.props.cells}
        showScaffolding={this.props.showScaffolding}
        setCellChildren={this.props.setCellChildren}
        countCell={() => this.cellIndex++}
        countCellId={this.countCellId}
        handleSort={this.handleSort}
        articlePxWidth={this.props.articlePxWidth}
      />
    )
  }
}

CellTree.propTypes = {
  view: PropTypes.object.isRequired,
  renderCell: PropTypes.func.isRequired,
  articlePxWidth: PropTypes.string
}

function CellTreeRecurse(props) {
  const {
    isRoot,
    cellId,
    renderCell,
    view,
    cells,
    setCellChildren,
    countCell,
    countCellId,
    handleSort,
    showScaffolding,
    articlePxWidth
  } = props;
  const children = cells[cellId]?.children || [];
  const cellVid = cellUtils.makeCellVid({
    cellId, count: countCellId(cellId)
  });
  const isExpanded = view.tabsView[view.currTabId]?.[cellVid]?.isExpanded;
  const isEmpty = children.length === 0;
  return (
    <div className="cell-tree" cellid={cellId} cellvid={cellVid}>
      {!isRoot && renderCell({ cellId, cellVid, cellIndex: countCell() })}
      {(isExpanded || isRoot) && (
        <ReactSortable
          className={
            clsx('cell-list', isEmpty && 'empty-article', isRoot && 'root-list')
          }
          group={dragGroup()}
          list={children}
          setList={newChildren => {
            setCellChildren({
              parentId: props.cellId,
              newChildren
            })
          }}
          style={{
            width: `${isEmpty ? articlePxWidth : 'fit-content'}`,
            border: `${(showScaffolding || (isExpanded && isEmpty)) ? '1px dashed white' : 'none'}`,
          }}
          viewId={view.id}
          cellId={cellId}
          id={cellVid}
          handle=".cell-handle"
          onSort={handleSort}
          onStart={cellUtils.handleDragStart}
          onEnd={cellUtils.handleDragEnd}
        >
          {children.map((child, index) => {
            return (
              <CellTreeRecurse
                key={child.id}
                cellId={child.id}
                renderCell={props.renderCell}
                view={props.view}
                cells={cells}
                setCellChildren={setCellChildren}
                showScaffolding={showScaffolding}
                countCell={countCell}
                countCellId={countCellId}
                handleSort={handleSort}
                articlePxWidth={articlePxWidth}
              />
            )
          })}
        </ReactSortable>
      )}
    </div>
  )
}

CellTreeRecurse.propTypes = {
  isRoot: PropTypes.bool,
  cellId: PropTypes.string.isRequired,
  renderCell: PropTypes.func.isRequired,
  view: PropTypes.object.isRequired,
  cells: PropTypes.object.isRequired,
  setCellChildren: PropTypes.func,
  countCell: PropTypes.func,
  countCellId: PropTypes.func,
  handleSort: PropTypes.func,
}

CellTreeRecurse.defaultProps = {
  isRoot: false,
  cellIndex: -1
}

export default connect(
  state => ({
    cells: state.view.cells,
    showScaffolding: state.view.showScaffolding,
  }),
  {
    setCellChildren,
    dragAndDropCellEffect
  }
)(CellTree);