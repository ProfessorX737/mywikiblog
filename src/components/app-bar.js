import React from "react";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../redux/auth-actions';
import store from '../redux/store';

import './app-bar.css';
import * as routes from '../constants/routes';

function AppBar(props) {
  const { loggedIn } = props;
  const handleMenuClick = () => {
    props.setNavMenuOpen(props.navMenuOpen ? false : true);
  };
  const handleLogout = () => { store.dispatch(logout()) }
  return (
    <div className="app-bar">
      <IconButton edge="start" onClick={handleMenuClick}>
        <MenuIcon />
      </IconButton>
      {loggedIn
      ? <Link className="auth-link" to={routes.login} onClick={handleLogout}>Log Out</Link>
      : (
        <>
          <Link className="auth-link" to={routes.login}>Login</Link>
        </>
      )}
    </div>
  );
}

AppBar.propTypes = {
  navMenuOpen: PropTypes.bool,
  setNavMenuOpen: PropTypes.func
};

export default connect(
  (state) => ({
    loggedIn: state.user.loggedIn
  }),
  null,
)(AppBar);
