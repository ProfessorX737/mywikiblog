import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import {
  toggleCellEdit,
  toggleCellExpand
} from "./redux/actions";
import "./cell-wrapper.css";

function CellWrapper(props) {
  const {
    view,
    viewPath,
    cellId,
    cellVid,
    cellWidth,
    toggleCellExpand,
    toggleCellEdit
  } = props;
  
  const onCellWrapperFocus = evt => {
    const cellWrapper = evt.target;
    setTimeout(() => {
      cellWrapper.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center"
      });
    });
  }

  const onToggleExpandCell = () => {
    toggleCellExpand({
      view,
      viewPath,
      vid: cellVid
    })
  }

  return (
    <div
      className="cell-wrapper"
      style={{width: cellWidth}}
      onFocus={onCellWrapperFocus}
    >
      <div
        className="cell-bar"
        onClick={onToggleExpandCell}
      >
      </div>
      <div className="content-wrapper">
        {props.children}
      </div>
    </div>
  )
}

CellWrapper.propTypes = {
  view: PropTypes.object.isRequired,
  viewPath: PropTypes.array.isRequired,
  cellVid: PropTypes.string.isRequired,
  cellWidth: PropTypes.string,
}

export default connect(
  null,
  { toggleCellEdit, toggleCellExpand}
)(CellWrapper);