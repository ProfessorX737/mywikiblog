import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import {
  toggleCellEdit,
  fetchChildCellsToggleExpand,
  patchContentToggleEdit
} from "./redux/actions";
import "./cell-wrapper.css";
import CellHandle from './cell-handle';

let refs = {};

class CellWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isFocused: false
    }
    this.contentRef = null;
    this.myRefKey = this.getRefKey(this.props.cellData.cellVid);
  }

  componentDidMount() {
    this.scrollContentIntoView();
  }

  getRefKey = cellVid => {
    const viewId = this.props.view.id;
    const tabId = this.props.view.currTabId;
    return `${viewId}_${tabId}_${cellVid}`;
  }

  render() {
    const {
      view,
      viewPath,
      cellData
    } = this.props;

    return (
      <div
        ref={el => { this.wrapperRef = el }}
        className="cell-wrapper"
        style={{ width: cellData.cellWidth }}
        onClick={() => { this.contentRef.focus() }}
      >
        <CellHandle
          view={view}
          viewPath={viewPath}
          cellData={cellData}
        />
        <div
          tabIndex={-1}
          onFocus={this.onFocusContent}
          onBlur={() => { this.setState({ isFocused: false }) }}
          ref={this.onContentRef}
          className={this.getContentClassname()}
          onKeyDown={this.onKeyDown}
        >
          {this.props.children}
        </div>
      </div>
    )
  }

  onKeyDown = evt => {
    const {
      view,
      viewPath,
      cellData
    } = this.props
    const {
      cellId,
      cellVid
    } = cellData;
    if (evt.key === "ArrowDown" || evt.key === 'j') {
      evt.preventDefault();
      this.focusNextCell(true);
    } else if (evt.key === "ArrowUp" || evt.key === 'k') {
      evt.preventDefault();
      this.focusNextCell(false);
    } else if (evt.key === "i" || (evt.shiftKey && evt.key === "Enter")) {
      this.props.patchContentToggleEdit({
        view,
        viewPath,
        cellVid,
        cellId
      })
      this.contentRef.focus();
    } else if (evt.key === "Enter") {
      this.props.fetchChildCellsToggleExpand({
        view,
        viewPath,
        cellId,
        cellVid,
        isExpanded: this.getCellView(cellVid)?.isExpanded
      })
    }
  }

  focusNextCell = isDown => {
    const vidList = this.getVidList(this.props.view.currTabId);
    const cellIndex = this.props.cellData.cellIndex;
    let index = isDown ? cellIndex + 1 : cellIndex - 1;
    if (index < 0 || index >= vidList.length) {
      index = isDown ? 0 : vidList.length - 1;
    }
    const nextRefKey = this.getRefKey(vidList[index]);
    refs[nextRefKey] && refs[nextRefKey].focus({ preventScroll: true });
  }

  // Recursively get all elements in the article in top down order
  getVidList = (id, path = "", isRoot = true) => {
    const vid = `${id}_${path}`;
    let keys = isRoot ? [] : [vid];
    if (isRoot || Boolean(this.getCellView(vid)?.isExpanded)) {
      const children = this.props.cells[id]?.children;
      for (let i = 0; i < children.length; i++) {
        keys.push(
          ...this.getVidList(children[i].id, `${path}c${i}`, false)
        );
      }
    }
    return keys;
  };

  getCellView(cellVid) {
    return this.props.view.tabsView[this.props.view.currTabId]?.[cellVid];
  }

  onContentRef = el => {
    this.contentRef = el;
    refs[this.myRefKey] = el;
  }

  onFocusContent = () => {
    this.setState({ isFocused: true })
    this.scrollContentIntoView();
  }

  scrollContentIntoView = () => {
    if (this.contentRef) this.contentRef.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center"
    })
  }

  getContentClassname = () => {
    return this.state.isFocused ? "content-wrapper-focused" : "content-wrapper";
  }
}

CellWrapper.propTypes = {
  view: PropTypes.object.isRequired,
  viewPath: PropTypes.array.isRequired,
  cellData: PropTypes.object.isRequired,
}

export default connect(
  state => ({
    focusData: state.focus.data,
    cells: state.view.cells
  }),
  {
    toggleCellEdit,
    fetchChildCellsToggleExpand,
    patchContentToggleEdit
  }
)(CellWrapper);