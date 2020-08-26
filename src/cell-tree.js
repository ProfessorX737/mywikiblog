import React from "react"
import PropTypes from 'prop-types'
import { connect } from "react-redux"
import { ReactSortable } from "react-sortablejs";
import "./cell-tree.css"
import clsx from 'clsx'
import {
  setCellChildren
} from "./redux/actions";

const dragGroup = cells => ({
  name: "cells",
  put: (to, from, el) => {
    const id = el.getAttribute("id");
    const toChilds = cells[to.options.id].children;
    // If the target article already contains a cell with the same id don't add it
    for (let i = 0; i < toChilds.length; i++) {
      if (toChilds[i].id === id) return false;
    }
    return true;
  },
  // pull: "clone"
  pull: (to, from, el) => {
    // if dragging between cells between different views then clone
    if (to.options.viewid !== from.options.viewid) {
      return "clone";
    }
    // if dragging between cells within the same view then move the cells
    return true;
  } 
})

const getCellVid = (id, path) => {
  return `${id}_${path}`;
}

export default class CellTree extends React.PureComponent {
  render() {
    return (
      <CellTreeRecurse
        isRoot={true}
        cellId={this.props.view.currTabId}
        renderCell={this.props.renderCell}
        view={this.props.view}
        cellPath=""
      />
    )
  }
}

CellTree.propTypes = {
  view: PropTypes.object.isRequired,
  renderCell: PropTypes.func.isRequired,
}

function _CellTreeRecurse(props) {
  const {
    isRoot,
    cellId,
    renderCell,
    view,
    cellPath,
    cells,
    setCellChildren
  } = props;
  const children = cells[cellId]?.children || [];
  const cellVid = getCellVid(cellId, cellPath);
  const isExpanded = view.tabsView[view.currTabId]?.[cellVid];
  return (
    <React.Fragment>
      {!isRoot && renderCell({cellId, cellVid})}
      {(isExpanded || isRoot) && (
        <ReactSortable
          className={
            clsx('cell-list', children.length === 0 && 'empty-article')
          }
          group={dragGroup(cells)}
          list={children}
          setList={newChildren => {setCellChildren({
            parentId: props.cellId,
            newChildren
          })}}
          style={{
            marginLeft: isRoot ? "0" : "1em"
          }}
          viewid={view.id}
        >
          {children.map((child, index) => {
            return (
              <CellTreeRecurse
                key={child.id}
                cellId={child.id}
                renderCell={props.renderCell}
                view={props.view}
                cellPath={`${cellPath}c${index}`}
              />
            )
          })}
        </ReactSortable>
      )}
    </React.Fragment>
  )
}

_CellTreeRecurse.propTypes = {
  isRoot: PropTypes.bool,
  cellId: PropTypes.string.isRequired,
  renderCell: PropTypes.func.isRequired,
  view: PropTypes.object.isRequired,
  cellPath: PropTypes.string.isRequired
}

_CellTreeRecurse.defaultProps = {
  isRoot: false,
}

const CellTreeRecurse = connect(
  state => ({ cells: state.cells }),
  { setCellChildren }
)(_CellTreeRecurse);