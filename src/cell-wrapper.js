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
    if(this.contentRef) this.contentRef.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center"
    })
  }

  render() {
    return (
      <div
        className="cell-wrapper"
        style={{ width: this.props.cellData.cellWidth }}
        onClick={ this.focusContent }
      >
        <CellHandle
          view={this.props.view}
          viewPath={this.props.viewPath}
          cellData={this.props.cellData}
        />
        <div
          ref={el => {this.contentRef = el}}
          className="content-wrapper"
          tabIndex={-1}
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
  null,
  { toggleCellEdit }
)(CellWrapper);