import React from "react";
import "./styles.css";
import TitleBar from "./title-bar";
import ViewPort from "./view-port";
import NavPane from "./nav-pane";
import ArticlesViewer from "./articles-viewer";
import assert from "assert";
import { connect } from "react-redux";
import { 
  fetchCells,
  fetchUserInit,
} from "./redux/actions";

const lsViewKey = "xavierunderstandsview";
const lsArticlesKey = "xavierunderstandsarticles";

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

  async componentDidMount() {
    let viewTree = false;
    // let viewTree = JSON.parse(localStorage.getItem(lsViewKey));
    // if there is no saved data then do default and get the user cell
    if (!viewTree) {
      this.defaultFetch();
    } else {
      // else we have saved view data so use that to
      // recursively find all cells we need to fetch
      // make sure to delete tabs/vids in the view that don't exist in the database
      let cells = JSON.parse(localStorage.getItem(lsArticlesKey));
      const ids = this.getRequiredIds(viewTree, cells);
      if(ids.length === 0) {
        this.defaultFetch();
        return;
      }

      fetchCells(
        { ids },
        cellList => {
          cells = {};
          // transform articleList to a article map (id => articleData)
          for(let i = 0; i < cellList.length; i++) {
            cells[cellList[i]._id] = {...cellList[i], id: cellList[i]._id};
          }
          // clean the view based on new cell data
          viewTree = this.recreateView(viewTree, cells);
          this.props.setStore({
            cells,
            viewTree
          })
        }
      );
    }
  }
  
  defaultFetch = () => {
    this.props.fetchUserInit({ email: "xavierpoon737@gmail.com" });
  }

  // restore and clean the old saved view
  recreateView = (view, articles) => {
    let tabs = [];
    // only add available tabs
    for(let i = 0; i < view.tabs.length; i++) {
      if(articles[view.tabs[i].id]) {
        tabs.push(view.tabs[i]);
      }
    }
    // only add available cells
    let tabsView = {};
    for(const tabId in view.tabsView) {
      if(articles[tabId]) {
        tabsView[tabId] = {};
        for(const vid in view.tabsView[tabId]) {
          const id = vid.replace(/_.*$/,'');
          if(articles[id]) {
            tabsView[tabId][vid] = view.tabsView[tabId][vid];
          }
        }
      }
    }
    // recursively do the same for all child views
    let children = [];
    for(let i = 0; i < view.children.length; i++) {
      children.push(this.recreateView(view.children[i], articles));
    }
    return {
      ...view,
      tabs,
      tabsView,
      children
    }
  }

  // get all required ids given the view and the articles
  getRequiredIds = (view, articles) => {
    let ids = new Set();
    let idExpand = this.getViewIds(view);
    for(const id in idExpand) {
      ids.add(id);
      if(idExpand[id]) {
        for(let i = 0; i < articles[id].children.length ; i++) {
          ids.add(articles[id].children[i].id);
        }
      }
    }
    return Array.from(ids);
  }

  // get a map of all (ids => isExpanded) in a view
  getViewIds = view => {
    let ids = {};
    if(view.tabsView) {
      for(const id in view.tabsView) {
        ids[id] = true;
        for(const vid in view.tabsView[id]) {
          const id2 = vid.replace(/_[0-9]+$/,'');
          // if we do not have id or it is expanded then skip
          if(ids[id2]) continue;
          ids[id2] = view.tabsView[id][vid].isExpanded;
        }
      }
    }
    for(let i = 0; i < view.children.length; i++) {
      const viewIds = this.getViewIds(view.children[i]);
      for(const id in viewIds) {
        if(ids[id]) continue;
        ids[id] = viewIds[id];
      }
    }
    return ids;
  }

  componentDidUpdate(prevProps, prevState) {
    try {
      assert.deepEqual(prevState.view, this.state.view);
    } catch(e) {
      // they are different update the view in local storage
      localStorage.setItem(lsViewKey, JSON.stringify(this.state.view));
    }
    try {
      assert.deepEqual(prevState.articles, this.state.articles);
    } catch(e) {
      // they are different update the view in local storage
      localStorage.setItem(lsArticlesKey, JSON.stringify(this.state.articles));
    }
  }

  setNavMenuOpen = arg => {
    const open = typeof arg === "function" ? arg(this.state.navMenuOpen) : arg;
    this.setState({ navMenuOpen: open });
  };

  render() {
    return (
      <div className="App" style={{overflow: "hidden"}}>
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
  { fetchUserInit }
)(App);