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
  fetchChildCellsToggleExpand
} from "./redux/actions";

function CellHandle(props) {
  const {
    view,
    viewPath,
    cellData,
    fetchChildCellsToggleExpand
  } = props;

  const onToggleCellExpand = evt => {
    fetchChildCellsToggleExpand({
      view,
      viewPath,
      cellId: cellData.cellId,
      cellVid: cellData.cellVid,
      isExpanded: cellData.isExpanded
    })
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
  { fetchChildCellsToggleExpand }
)(CellHandle);