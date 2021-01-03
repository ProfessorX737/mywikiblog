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

import TitleBar from "./components/title-bar";
import NavPane from "./components/nav-pane";
import ArticlesViewer from "./pages/articles-viewer";
import {
  localStorageInit
} from "./redux/actions";
import './App.css';
import history from './common/history';
import * as storage from './common/localStorage';
import * as routes from './constants/routes';
import theme from './constants/theme';
import Login from './pages/login';

class App extends React.Component {
  state = {
    navMenuOpen: false,
    view: {
      id: "1",
      currTabId: 0,
      tabs: [],
      tabsView: {},
      children: []
    },
    articles: {}
  };

  componentDidMount() {
    this.props.localStorageInit();
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
      <ThemeProvider theme={theme}>
        <div className="view-port">
          <TitleBar
            navMenuOpen={this.state.navMenuOpen}
            setNavMenuOpen={this.setNavMenuOpen}
          />
          <div className="not-header">
            <NavPane
              navMenuOpen={this.state.navMenuOpen}
              setNavMenuOpen={this.setNavMenuOpen}
            />
            <Router history={history}>
              <Switch>
                <Route exact path={routes.home}>
                  <ArticlesViewer view={this.props.viewTree} />
                </Route>
                <Route path={routes.login} component={Login} />
              </Switch>
            </Router>
          </div>
        </div>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  cells: state.view.cells,
  viewTree: state.view.viewTree,
})

export default connect(
  mapStateToProps,
  { localStorageInit }
)(App);