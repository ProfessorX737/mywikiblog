import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import {
  toggleCellEdit,
  fetchChildCellsToggleExpand,
  patchContentToggleEdit,
  postNewChildCellExpand,
  deleteChild
} from "./redux/actions";
import "./cell-wrapper.css";
import CellHandle from './cell-handle';
import * as cellUtils from './cell-utils';

let refs = {};
let newCellIndex = null;

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
    if(this.props.cellData.cellIndex === newCellIndex) {
      this.contentRef.focus({ preventScroll: true });
      newCellIndex = null;
    }
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
        style={{ width: this.getArticlePxWidth() }}
        onClick={() => { this.contentRef.focus({ preventScroll: true }) }}
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
      cellVid,
      cellIndex
    } = cellData;
    if (evt.key.match(/^[jJ]$/)) {
      evt.stopPropagation();
      if(this.getIsCellBottomHidden() && evt.key === 'j') {
        this.props.articleRef.scroll({
          top: this.props.articleRef.scrollTop + 50,
          left: this.props.articleRef.scrollLeft,
          behavior: 'smooth'
        })
      } else {
        this.focusNextCell(true);
      }
    } else if (evt.key.match(/^[kK]$/)) {
      evt.stopPropagation();
      if(this.getIsCellTopHidden() && evt.key === 'k') {
        this.props.articleRef.scroll({
          top: this.props.articleRef.scrollTop - 50,
          left: this.props.articleRef.scrollLeft,
          behavior: 'smooth'
        })
      } else {
        this.focusNextCell(false);
      }
    } else if (evt.key === "i" || (evt.shiftKey && evt.key === "Enter")) {
      this.props.patchContentToggleEdit({
        view,
        viewPath,
        cellVid,
        cellId
      })
      this.contentRef.focus({ preventScroll: true });
    } else if (evt.key === "Enter") {
      this.props.fetchChildCellsToggleExpand({
        view,
        viewPath,
        cellId,
        cellVid,
        isExpanded: this.getIsExpanded(cellVid)
      })
    } else if (evt.key === "a" || evt.key === "A") {
      const childCount = this.props.cells[cellId].children.length;
      this.props.postNewChildCellExpand({
        view,
        viewPath,
        parentId: cellId,
        parentVid: cellVid,
        insertIndex: evt.key === "a" ?
          0 : childCount 
      })
      newCellIndex = evt.key === "a" ?
        cellIndex + 1 : cellIndex + childCount + 1;
    } else if (evt.key === "o" || evt.key === "O") {
      const childIndex = this.getChildIndex(); 
      const parentVid = this.wrapperRef.parentNode.getAttribute('id');
      const parentId = cellUtils.cellVidToId(parentVid);
      this.props.postNewChildCellExpand({
        view,
        viewPath,
        parentId,
        parentVid,
        insertIndex: evt.key === "o" ? childIndex + 1 : childIndex
      })
      newCellIndex = evt.key === "o" ?
        cellIndex + 1 : cellIndex;
    } else if (evt.key === "D") {
      const childIndex = this.getChildIndex();
      const parentVid = this.wrapperRef.parentNode.getAttribute('id');
      const parentId = cellUtils.cellVidToId(parentVid);
      this.props.deleteChild({
        parentId,
        childIndex,
        focusNextCell: () => {
          this.focusNextCell(cellIndex === 0);
        }
      })
    }
  }

  getArticlePxWidth = () => {
    return this.props.articleRef ?
      `${this.props.articleRef.clientWidth}px` : '0px';
  }

  getIsCellTopHidden = () => {
    return this.wrapperRef.offsetTop < this.props.articleRef.scrollTop;
  }

  getIsCellBottomHidden = () => {
    const wrapperBottom = this.wrapperRef.offsetTop + this.wrapperRef.offsetHeight;
    const windowBottom = this.props.articleRef ?
      this.props.articleRef.scrollTop + this.props.articleRef.offsetHeight : 0;
    return wrapperBottom > windowBottom;
  }

  getChildIndex = () => {
    return [...this.wrapperRef.parentNode.children].filter(el => {
      return el.className === 'cell-wrapper'
    }).indexOf(this.wrapperRef);
  }

  focusNextCell = isDown => {
    const vidList = cellUtils.getCellVidList({
      cellId: this.props.view.currTabId,
      cells: this.props.cells,
      getIsExpanded: this.getIsExpanded
    });
    const cellIndex = this.props.cellData.cellIndex;
    let index = isDown ? cellIndex + 1 : cellIndex - 1;
    if (index < 0 || index >= vidList.length) {
      index = isDown ? 0 : vidList.length - 1;
    }
    const nextRefKey = this.getRefKey(vidList[index]);
    refs[nextRefKey] && refs[nextRefKey].focus({ preventScroll: true });
  }

  getIsExpanded = cellVid => {
    const view = this.props.view;
    return Boolean(view.tabsView[view.currTabId]?.[cellVid]?.isExpanded);
  }

  onContentRef = el => {
    if (el) {
      this.contentRef = el;
      refs[this.myRefKey] = el;
    }
  }

  onFocusContent = () => {
    this.setState({ isFocused: true })
    this.scrollContentIntoView();
  }

  scrollContentIntoView = () => {
    let block = "center";
    if(this.wrapperRef.clientHeight > this.props.articleRef?.clientHeight) {
      block = "start";
    }
    if (this.contentRef) this.contentRef.scrollIntoView({
      behavior: "smooth",
      block,
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
  articleRef: PropTypes.object
}

export default connect(
  state => ({
    cells: state.view.cells
  }),
  {
    toggleCellEdit,
    fetchChildCellsToggleExpand,
    patchContentToggleEdit,
    postNewChildCellExpand,
    deleteChild
  }
)(CellWrapper);