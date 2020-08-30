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

  renderCell = ({ cellId, cellVid, cellIndex }) => {
    const cellData = {
      cellId,
      cellVid,
      children: [],
      ...this.props.cells[cellId],
      ...this.props.view.tabsView[this.props.view.currTabId]?.[cellVid],
      cellWidth: this.getArticleWidth(),
      cellIndex
    }
    return (
        <CellWrapper
          view={this.props.view}
          viewPath={this.props.viewPath}
          cellData={cellData}
        >
          <MarkdownCell
            view={this.props.view}
            viewPath={this.props.viewPath}
            cellData={cellData}
          />
        </CellWrapper>
    )
  }

  render() {
    return (
      <div
        className="article-plane"
        ref={el => { this.myrefs["plane"] = el }}
        onClick={this.onBackgroundClick}
      >
        <CellTree
          view={this.props.view}
          renderCell={this.renderCell}
        />
      </div>
    )
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
  }),
  {
    insertNewChildCell,
    fetchChildCells,
  }
)(Article)