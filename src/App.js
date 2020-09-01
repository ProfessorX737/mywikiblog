import React from "react";
import "./styles.css";
import TitleBar from "./title-bar";
import ViewPort from "./view-port";
import NavPane from "./nav-pane";
import ArticlesViewer from "./articles-viewer";
import assert from "assert";
import { connect } from "react-redux";
import {
  localStorageInit
} from "./redux/actions";
import * as constants from './constants';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
  }

  componentDidMount() {
    this.props.localStorageInit();
  }

  componentDidUpdate(prevProps, prevState) {
    try {
      assert.deepEqual(prevProps.viewTree, this.props.viewTree);
    } catch (e) {
      // they are different update the view in local storage
      localStorage.setItem(
        constants.LOCAL_STORAGE_KEY,
        JSON.stringify(this.props.viewTree)
      );
    }
  }

  setNavMenuOpen = arg => {
    const open = typeof arg === "function" ? arg(this.state.navMenuOpen) : arg;
    this.setState({ navMenuOpen: open });
  };

  render() {
    return (
      <div className="App" style={{ overflow: "hidden" }}>
        <ViewPort>
          <TitleBar
            navMenuOpen={this.state.navMenuOpen}
            setNavMenuOpen={this.setNavMenuOpen}
          />
          <div className="not-header">
            <NavPane
              navMenuOpen={this.state.navMenuOpen}
              setNavMenuOpen={this.setNavMenuOpen}
            />
            <ArticlesViewer
              view={this.props.viewTree}
            />
          </div>
        </ViewPort>
      </div>
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