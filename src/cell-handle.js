import React from 'react';
import {
	ExpandMoreRounded,
	ChevronRightRounded,
	ArrowDropDownRounded,
	ArrowRightRounded,
} from "@material-ui/icons";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import "./cell-wrapper.css";
import {
  toggleCellExpand,
  fetchChildCells
} from "./redux/actions";

function CellHandle(props) {
  const {
    view,
    viewPath,
    cellData,
    toggleCellExpand,
    fetchChildCells
  } = props;

  const onToggleCellExpand = () => {
    toggleCellExpand({
      view,
      viewPath,
      cellVid: cellData.cellVid
    })
    // todo only fetch if neccessary
    fetchChildCells({ cellId: cellData.cellId });
  }

  return (
    <div
      className="cell-handle"
      onClick={onToggleCellExpand}
    >
      {cellData.children.length > 0 &&
        (cellData.isEditing ? (
        cellData.isExpanded ? (
          <ExpandMoreRounded
          fontSize="small"
          style={{ color: "white", width: "0.9em" }}
          />
        ) : (
          <ChevronRightRounded
          fontSize="small"
          style={{ color: "white", width: "0.9em" }}
          />
        )
        ) : cellData.isExpanded ? (
        <ArrowDropDownRounded style={{ color: "white", width: "0.9em" }} />
        ) : (
        <ArrowRightRounded style={{ color: "white", width: "0.9em" }} />
        ))}
      {cellData.isExpanded &&
        cellData.children.length === 0 &&
        (cellData.isEditing ? (
        <ExpandMoreRounded
          fontSize="small"
          style={{ color: "white", width: "0.9em" }}
        />
        ) : (
        <ArrowDropDownRounded style={{ color: "white", width: "0.9em" }} />
        ))}
    </div>
  )
}

CellHandle.propTypes = {
  view: PropTypes.object.isRequired,
  viewPath: PropTypes.array.isRequired,
  cellData: PropTypes.object.isRequired
}

export default connect(
  null,
  { toggleCellExpand, fetchChildCells }
)(CellHandle);