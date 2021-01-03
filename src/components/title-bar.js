import React from "react";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import PropTypes from "prop-types";

import './title-bar.css';

export default function TitleBar(props) {
  const handleMenuClick = () => {
    props.setNavMenuOpen(props.navMenuOpen ? false : true);
  };
  return (
    <div className="app-bar">
      <IconButton edge="start" onClick={handleMenuClick}>
        <MenuIcon />
      </IconButton>
    </div>
  );
}

TitleBar.propTypes = {
  navMenuOpen: PropTypes.bool,
  setNavMenuOpen: PropTypes.func
};
