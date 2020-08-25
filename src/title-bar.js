import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import PropTypes from "prop-types";

export default function TitleBar(props) {
  const handleMenuClick = () => {
    props.setNavMenuOpen(props.navMenuOpen ? false : true);
  };
  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <IconButton edge="start" onClick={handleMenuClick}>
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

TitleBar.propTypes = {
  navMenuOpen: PropTypes.bool,
  setNavMenuOpen: PropTypes.func
};
