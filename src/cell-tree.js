import React from "react"
import PropTypes from 'prop-types'
import { connect } from "react-redux"
import { ReactSortable } from "react-sortablejs";
import "./cell-tree.css"
import clsx from 'clsx'
import {
  setCellChildren
} from "./redux/actions";
import * as cellUtils from './cell-utils'

ReactSortable.prototype.onChoose = function (evt) { };
ReactSortable.prototype.onUnchoose = function (evt) { };

const dragGroup = cells => ({
  name: "cells",
  put: (to, from, el) => {
    const toChilds = cells[to.options.cellId].children;
    // If the target article already contains a cell with the same id don't add it
    const id = el.getAttribute("id");
    for (let i = 0; i < toChilds.length; i++) {
      if (toChilds[i].id === id) return false;
    }
    return true;
  },
  // pull: "clone"
  pull: (to, from, el) => {
    // if dragging between cells between different views then clone
    if (to.options.viewId !== from.options.viewId) {
      return "clone";
    }
    // if dragging between cells within the same view then move the cells
    return true;
  }
})

export default function CellTree(props) {
  let cellIndex = 0;
  let cellIdCount = {};
  const countCellId = cellId => {
    let count = cellIdCount[cellId];
    count = count ? count + 1 : 1;
    cellIdCount[cellId] = count;
    return count;
  }
  return (
    <CellTreeRecurse
      isRoot={true}
      cellId={props.view.currTabId}
      renderCell={props.renderCell}
      view={props.view}
      cellPath=""
      countCell={() => cellIndex++}
      countCellId={countCellId}
    />
  )
}

CellTree.propTypes = {
  view: PropTypes.object.isRequired,
  renderCell: PropTypes.func.isRequired,
}

function CellTreeRecurse_(props) {
  const {
    isRoot,
    cellId,
    renderCell,
    view,
    cells,
    setCellChildren,
    countCell,
    countCellId
  } = props;
  const children = cells[cellId]?.children || [];
  const cellVid = cellUtils.makeCellVid({
    cellId, count: countCellId(cellId)
  });
  const isExpanded = view.tabsView[view.currTabId]?.[cellVid]?.isExpanded;
  return (
    <React.Fragment>
      {!isRoot && renderCell({ cellId, cellVid, cellIndex: countCell() })}
      {(isExpanded || isRoot) && (
        <ReactSortable
          className={
            clsx('cell-list', children.length === 0 && 'empty-article')
          }
          group={dragGroup(cells)}
          list={children}
          setList={newChildren => {
            setCellChildren({
              parentId: props.cellId,
              newChildren
            })
          }}
          style={{
            margin: `0 auto 0 ${isRoot ? 'auto' : '1em'}`
          }}
          viewId={view.id}
          id={cellVid}
          handle=".cell-handle"
        >
          {children.map((child, index) => {
            return (
              <CellTreeRecurse
                key={child.id}
                cellId={child.id}
                renderCell={props.renderCell}
                view={props.view}
                countCell={countCell}
                countCellId={countCellId}
              />
            )
          })}
        </ReactSortable>
      )}
    </React.Fragment>
  )
}

CellTreeRecurse_.propTypes = {
  isRoot: PropTypes.bool,
  cellId: PropTypes.string.isRequired,
  renderCell: PropTypes.func.isRequired,
  view: PropTypes.object.isRequired,
  countCell: PropTypes.func,
  countCellId: PropTypes.func,
}

CellTreeRecurse_.defaultProps = {
  isRoot: false,
  cellIndex: -1
}

const CellTreeRecurse = connect(
  state => ({ cells: state.view.cells }),
  { setCellChildren }
)(CellTreeRecurse_);