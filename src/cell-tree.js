import React from "react"
import PropTypes from 'prop-types'
import { connect } from "react-redux"
import { ReactSortable } from "react-sortablejs";
import "./cell-tree.css"
import clsx from 'clsx'
import {
  setCellChildren,
  dragAndDropCellEffect
} from "./redux/actions";
import * as cellUtils from './cell-utils'

// ReactSortable.prototype.onChoose = function (evt) { };
// ReactSortable.prototype.onUnchoose = function (evt) { };

const dragGroup = cells => ({
  name: "cells",
  put: (to, from, el) => {
    const toChilds = cells[to.options.cellId].children;
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
    // if dragging between two different lists then cline
    if (to.options.cellId !== from.options.cellId) {
      return "clone";
    }
    // if dragging between cells within the same view then move the cells
    return true;
  }
})

// function CellTree(props) {

//   let cellIndex = 0;
//   let cellIdCount = {};

//   const countCellId = cellId => {
//     let count = cellIdCount[cellId];
//     count = count ? count + 1 : 1;
//     cellIdCount[cellId] = count;
//     return count;
//   }

//   const handleSort = evt => {
//     if (evt.srcElement === evt.from) {
//       // this.props.dragAndDropCellEffect({
//       //   oldParentId:
//       // })
//     }
//   }

//   return (
//     <CellTreeRecurse
//       isRoot={true}
//       cellId={props.view.currTabId}
//       renderCell={props.renderCell}
//       view={props.view}
//       cells={props.cells}
//       setCellChildren={props.setCellChildren}
//       countCell={() => cellIndex++}
//       countCellId={countCellId}
//       handleSort={handleSort}
//       articlePxWidth={props.articlePxWidth}
//     />
//   )

// }

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
    if (evt.srcElement === evt.from) {
      // this.props.dragAndDropCellEffect({
      //   oldParentId:
      // })
    }
  }

  render() {
    return (
      <CellTreeRecurse
        isRoot={true}
        cellId={this.props.view.currTabId}
        renderCell={this.props.renderCell}
        view={this.props.view}
        cells={this.props.cells}
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
          group={dragGroup(cells)}
          list={children}
          setList={newChildren => {
            setCellChildren({
              parentId: props.cellId,
              newChildren
            })
          }}
          style={{
            width: `${isEmpty ? articlePxWidth : 'fit-content'}`,
          }}
          viewId={view.id}
          cellId={cellId}
          id={cellVid}
          handle=".cell-handle"
          onSort={handleSort}
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
  state => ({ cells: state.view.cells }),
  {
    setCellChildren,
    dragAndDropCellEffect
  }
)(CellTree);