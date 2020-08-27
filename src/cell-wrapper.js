import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import {
  toggleCellEdit,
  toggleCellExpand
} from "./redux/actions";
import "./cell-wrapper.css";
import CellHandle from './cell-handle';

function CellWrapper(props) {
  const {
    view,
    viewPath,
    cellData,
    toggleCellExpand
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
      cellVid: cellData.cellVid
    })
  }

  return (
    <div
      className="cell-wrapper"
      style={{ width: cellData.cellWidth }}
      onFocus={onCellWrapperFocus}
    >
      <CellHandle
        view={view}
        viewPath={viewPath}
        cellData={cellData}
      />
      <div className="content-wrapper">
        {props.children}
      </div>
    </div>
  )
}

CellWrapper.propTypes = {
  view: PropTypes.object.isRequired,
  viewPath: PropTypes.array.isRequired,
  cellData: PropTypes.object.isRequired,
}

export default connect(
  null,
  { toggleCellEdit, toggleCellExpand}
)(CellWrapper);