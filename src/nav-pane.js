import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import clsx from "clsx";
import PropTypes from "prop-types";

const useStyles = makeStyles(() => ({
  navPane: {
    display: "flex",
    flexFlow: "column",
    height: "inherit",
    overflowY: "scroll",
    overflowX: "auto",
    backgroundColor: "white",
    transition: "flex 0.3s ease-out",
    flex: 0
  },
  drawer: {
    border: "1px solid blue"
  },
  drawerExpanded: {
    flexBasis: "250px"
  },
  drawerPaper: {
    display: "flex",
    overflowY: "scroll",
    overflowX: "auto",
    border: "1px solid red",
    position: "static"
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end"
  }
}));

export default function NavPane(props) {
  const classes = useStyles();
  const handleCloseNavPane = () => {
    props.setNavMenuOpen(false);
  };
  return (
    <div
      className={clsx(
        classes.navPane,
        props.navMenuOpen && classes.drawerExpanded
      )}
    >
      <div className={classes.drawerHeader}>
        <IconButton onClick={handleCloseNavPane}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
    </div>
  );
}

NavPane.propTypes = {
  navMenuOpen: PropTypes.bool,
  setNavMenuOpen: PropTypes.func
};
