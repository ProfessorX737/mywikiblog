import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import CellTree from "./cell-tree"
import "./article.css"
import CellWrapper from './cell-wrapper'
import MarkdownCell from "./markdown-cell"
import {
  insertNewChildCell,
  fetchChildCells,
  setFocusData
} from './redux/actions'

class Article extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      resized: 1
    }
    this.myrefs = {}
    props.fetchChildCells({ cellId: props.view.currTabId });
  }

  componentDidUpdate(prevProps) {
    // when the current tab changes we want to fetch child cells
    // of the cell with id = currTabId
    const currTabId = this.props.view.currTabId;
    if (currTabId !== prevProps.view.currTabId) {
      this.props.fetchChildCells({ cellId: currTabId });
    }
  }

  getArticleWidth = () => {
    const plane = this.myrefs["plane"];
    return plane ? `${this.myrefs["plane"].clientWidth}px` : '0px';
  }

  setFocusData = (cellVid, cellIndex) => {
    this.props.setFocusData({
      viewId: this.props.view.id,
      tabId: this.props.view.currTabId,
      cellVid,
      cellIndex
    })
  }

  renderCell = ({ cellId, cellVid, cellIndex }) => {
    const cellData = {
      cellId,
      cellVid,
      children: [],
      ...this.props.cells[cellId],
      ...this.props.view.tabsView[this.props.view.currTabId]?.[cellVid],
      cellWidth: this.getArticleWidth()
    }
    return (
      <div
        onClick={() => { this.setFocusData(cellVid, cellIndex) }}
      >
        <CellWrapper
          view={this.props.view}
          viewPath={this.props.viewPath}
          cellData={cellData}
        >
          <MarkdownCell
            view={this.props.view}
            cellData={cellData}
          />
        </CellWrapper>
      </div>
    )
  }

  render() {
    return (
      <div
        tabIndex={-1}
        className="article-plane"
        ref={el => { this.myrefs["plane"] = el }}
        onKeyDown={evt => this.onKeyDown(evt)}
        onClick={this.onBackgroundClick}
      >
        <CellTree
          view={this.props.view}
          renderCell={this.renderCell}
        />
      </div>
    )
  }

  getCellView(cellVid) {
    return this.props.view.tabsView[this.props.view.currTabId]?.[cellVid];
  }

  // Recursively get all elements in the article in top down order
  getArticleVidList = (id, path = "", isRoot = true) => {
    const vid = `${id}_${path}`;
    let keys = isRoot ? [] : [vid];
    if (isRoot || Boolean(this.getCellView(vid)?.isExpanded)) {
      const children = this.props.cells[id]?.children;
      for (let i = 0; i < children.length; i++) {
        keys.push(
          ...this.getArticleVidList(children[i].id, `${path}c${i}`, false)
        );
      }
    }
    return keys;
  };

  onKeyDown = (evt) => {
    evt.stopPropagation();
    if (evt.key === "ArrowDown" || evt.key === 'j') {
      this.focusNextCell(true);
    } else if (evt.key === "ArrowUp" || evt.key === 'k') {
      this.focusNextCell(false);
    } else if (evt.key === "Enter") {
      this.toggleCellExpand();
    }
  }

  focusNextCell = (isDown) => {
    const vidList = this.getArticleVidList(this.props.view.currTabId);
    const focusData = this.props.focusData;
    let index = 0;
    if (!focusData) {
      index = isDown ? 0 : vidList.length - 1;
    } else {
      const cellIndex = focusData.cellIndex;
      index = isDown ? cellIndex + 1 : cellIndex - 1;
      if (index < 0 || index >= vidList.length) {
        index = isDown ? 0 : vidList.length - 1;
      }
    }
    this.props.setFocusData({
      viewId: this.props.view.id,
      tabId: this.props.view.currTabId,
      cellVid: vidList[index],
      cellIndex: index
    })
  }

  onBackgroundClick = evt => {
    if(evt.target === this.myrefs["plane"]) {
      this.props.setFocusData(null);
    }
  }
}

Article.propTypes = {
  view: PropTypes.object.isRequired,
  viewPath: PropTypes.array.isRequired
}

export default connect(
  state => ({
    cells: state.view.cells,
    viewTree: state.view.viewTree,
    focusData: state.focus.data
  }),
  {
    setFocusData,
    insertNewChildCell,
    fetchChildCells,
  }
)(Article)