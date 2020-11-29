import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import CellTree from "./cell-tree"
import "./article.css"
import CellWrapper from './cell-wrapper'
import MarkdownCell from "./markdown-cell"
import {
  fetchChildCells,
} from './redux/actions'
import ReactResizeDetector from 'react-resize-detector'

class Article extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      resized: false
    }
    this.myrefs = {}
    props.fetchChildCells({ cellId: props.view.currTabId });
  }

  componentDidMount() {
    this.articleRef.focus();
  }

  componentDidUpdate(prevProps) {
    // when the current tab changes we want to fetch child cells
    // of the cell with id = currTabId
    const currTabId = this.props.view.currTabId;
    if (currTabId !== prevProps.view.currTabId) {
      this.props.fetchChildCells({ cellId: currTabId });
    }
  }

  renderCell = ({ cellId, cellVid, cellIndex }) => {
    const cellData = {
      cellId,
      cellVid,
      children: [],
      ...this.props.cells[cellId],
      ...this.props.view.tabsView[this.props.view.currTabId]?.[cellVid],
      cellIndex
    }
    return (
        <CellWrapper
          view={this.props.view}
          viewPath={this.props.viewPath}
          cellData={cellData}
          articleRef={this.articleRef}
        >
          <MarkdownCell
            view={this.props.view}
            viewPath={this.props.viewPath}
            cellData={cellData}
          />
        </CellWrapper>
    )
  }

  getArticlePxWidth = () => {
    return this.articleRef ?
      `${this.articleRef.clientWidth}px` : '0px';
  }

  onKeyDown = evt => {
    if (evt.key.match(/^[jJ]$/)) {
      evt.preventDefault();
      let el = this.articleRef;
      while(el && !el.className.match(/^cell-wrapper/)) {
        el = el.firstChild;
      }
      const first = el?.children[1];
      first && first.focus();
    } else if (evt.key.match(/^[kK]$/)) {
      evt.preventDefault();
      let el = this.articleRef;
      while(el && !el.className.match(/^cell-list/)) {
        el = el.children[0];
      }
      while(el && !el.className.match(/^cell-wrapper/)) {
        el = el.lastChild;
      }
      const last = el?.children[1];
      last && last.focus();
    }
  }

  render() {
    return (
      <div
        tabIndex={-1}
        className="article-plane"
        ref={el => { this.articleRef = el }}
        onClick={this.onBackgroundClick}
        onKeyDown={this.onKeyDown}
      >
        <CellTree
          view={this.props.view}
          renderCell={this.renderCell}
          articlePxWidth={this.getArticlePxWidth()}
        />
        <ReactResizeDetector
          handleWidth
          handleHeight
          onResize={() => {
            this.setState({resized: !this.state.resized})
          }}
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
    fetchChildCells,
  }
)(Article)