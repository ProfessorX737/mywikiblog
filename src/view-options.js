import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Menu,
  MenuItem,
  withStyles
} from "@material-ui/core";
import {
  VerticalSplit,
  HorizontalSplit,
  CancelPresentation,
  Delete,
  MoreVert
} from "@material-ui/icons";
import {
  splitView,
  deleteView
} from "./redux/actions";

const Hmenu = withStyles({
  paper: {
    zIndex: "1"
  },
  list: {
    display: "flex",
    padding: 0
  }
})(Menu);

class ViewOptions extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      menuAnchor: null,
      deleteMode: false
    }
  }

  handleMoreBtnClick = evt => {
    this.setState({menuAnchor: evt.currentTarget.parentNode});
  }

  onMenuClose = () => {
    this.setState({menuAnchor: null});
  }

  onSplitView = direction => {
    this.onMenuClose();
    this.props.splitView({
      view: this.props.view,
      viewPath: this.props.viewPath,
      direction
    });
  }

  onDeleteView = () => {
    this.onMenuClose();
    this.props.deleteView({
      viewPath: this.props.viewPath
    })
  }

  render() {
    return (
      <React.Fragment>
        <div className="more-btn"
          onClick={evt => {this.handleMoreBtnClick(evt)}}
        >
          <MoreVert fontSize="small" />
        </div> 
        <Hmenu
          anchorEl={this.state.menuAnchor}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          onClose={this.onMenuClose}
          getContentAnchorEl={null}
          open={Boolean(this.state.menuAnchor)}
        >
          <MenuItem onClick={() => {this.onSplitView("row")}}>
            <VerticalSplit />
          </MenuItem>
          <MenuItem onClick={() => {this.onSplitView("column")}}>
            <HorizontalSplit />
          </MenuItem>
          {this.props.viewPath.length > 0 && (
            <MenuItem
              onClick={this.onDeleteView}
            >
              <CancelPresentation />
            </MenuItem>
          )}
        </Hmenu>
      </React.Fragment>
    )
  }
}

ViewOptions.propTypes = {
  view: PropTypes.object.isRequired,
  viewPath: PropTypes.array.isRequired
}

export default connect(
  state => ({ cells: state.cells }),
  { 
    splitView,
    deleteView
  }
)(ViewOptions);