import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import {
  toggleCellEdit,
} from "./redux/actions";
import "./cell-wrapper.css";
import CellHandle from './cell-handle';

class CellWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.contentRef = null;
  }

  componentDidMount() {
    this.scrollContentIntoView();
  }

  focusContent = () => {
    this.contentRef.focus();
    setTimeout(() => {
      this.scrollContentIntoView();
    });
  }

  scrollContentIntoView = () => {
    if (this.contentRef) this.contentRef.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center"
    })
  }

  getContentClass = cellVid => {
    const focusData = this.props.focusData;
    if (focusData) {
      if (focusData.viewId === this.props.view.id) {
        if (focusData.tabId === this.props.view.currTabId) {
          if (focusData.cellVid === cellVid) {
            return "content-wrapper-focused";
          }
        }
      }
    }
    return "content-wrapper";
  }

  render() {
    const {
      view,
      viewPath,
      cellData
    } = this.props;
    return (
      <div
        className="cell-wrapper"
        style={{ width: cellData.cellWidth }}
        onClick={this.focusContent}
      >
        <CellHandle
          view={view}
          viewPath={viewPath}
          cellData={cellData}
        />
        <div
          ref={el => { this.contentRef = el }}
          className={this.getContentClass(cellData.cellVid)}
        >
          {this.props.children}
        </div>
      </div>
    )
  }
}

CellWrapper.propTypes = {
  view: PropTypes.object.isRequired,
  viewPath: PropTypes.array.isRequired,
  cellData: PropTypes.object.isRequired,
}

export default connect(
  state => ({ focusData: state.focus.data }),
  { toggleCellEdit }
)(CellWrapper);