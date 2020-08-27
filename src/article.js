import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import CellTree from "./cell-tree"
import "./article.css"
import CellWrapper from './cell-wrapper'
import MarkdownCell from "./markdown-cell"
import {
  insertCells,
  fetchCells,
  fetchChildCells
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
    const currTabId = this.props.view.currTabId;
    if(currTabId !== prevProps.view.currTabId) {
      this.props.fetchChildCells({ cellId: currTabId });
    }
  }

  getArticleWidth = () => {
    const plane = this.myrefs["plane"];
    return plane ? `${this.myrefs["plane"].clientWidth}px`: '0px';
  }

  renderCell = ({cellId, cellVid}) => {
    const cellData = {
      cellId,
      cellVid,
      children: [],
      ...this.props.cells[cellId],
      ...this.props.view.tabsView[this.props.view.currTabId]?.[cellVid],
      cellWidth: this.getArticleWidth()
    }
    return (
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
    )
  }

  render() {
    return (
      <div
        className="article-plane"
        ref={el => { this.myrefs["plane"] = el}}
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
    cells: state.cells,
    viewTree: state.viewTree
  }),
  { insertCells, fetchCells, fetchChildCells }
)(Article)