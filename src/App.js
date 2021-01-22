import React from "react";
import {
  Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import assert from "assert";
import { connect } from "react-redux";
import { ThemeProvider } from 'styled-components';

import AppBar from "./components/app-bar";
import NavPane from "./components/nav-pane";
import ArticlesViewer from "./pages/articles-viewer";
import { localStorageInit } from "./redux/actions";
import { updateAuthStatus } from './redux/auth-actions';
import './App.css';
import history from './common/history';
import * as storage from './common/localStorage';
import * as routes from './constants/routes';
import theme from './constants/theme';
import Login from './pages/login';
import store from './redux/store';

class App extends React.Component {
  state = { navMenuOpen: false };

  componentDidMount() {
    const reloadPage = () => {
      console.log("reloading page");
      store.dispatch(localStorageInit());
      store.dispatch(updateAuthStatus());
    }
    reloadPage();
    // When changing the route to the home page we want to reinitialize the local storage
    // in case there are any changes in authentication or just updates in the blog
    //history.listen(reloadPage);
  }

  componentDidUpdate(prevProps, prevState) {
    try {
      assert.deepStrictEqual(prevProps.viewTree, this.props.viewTree);
    } catch (e) {
      // they are different update the view in local storage
      storage.setView(this.props.viewTree)
    }
  }

  setNavMenuOpen = arg => {
    const open = typeof arg === "function" ? arg(this.state.navMenuOpen) : arg;
    this.setState({ navMenuOpen: open });
  };

  render() {
    return (
      <Router history={history}>
        <ThemeProvider theme={theme}>
          <div className="view-port">
            <AppBar
              navMenuOpen={this.state.navMenuOpen}
              setNavMenuOpen={this.setNavMenuOpen}
            />
            <div className="not-header">
              <NavPane
                navMenuOpen={this.state.navMenuOpen}
                setNavMenuOpen={this.setNavMenuOpen}
              />
              <Switch>
                <Route exact path={"/"}>
                  <Redirect to={routes.getHomeRoute('')} />
                </Route>
                <Route path={routes.getHomeRoute()} render={(props) => <ArticlesViewer view={this.props.viewTree} {...props}/>} />
                <Route path={routes.login} component={Login} />
              </Switch>
            </div>
          </div>
        </ThemeProvider>
      </Router>
    );
  }
}

const mapStateToProps = state => ({
  cells: state.view.cells,
  viewTree: state.view.viewTree,
})

export default connect(
  mapStateToProps,
  null,
)(App);