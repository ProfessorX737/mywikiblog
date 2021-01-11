import React from "react";
import PropTypes from "prop-types";
import Article from "./article";
import { connect } from "react-redux";
import {
  splitView,
} from "../../redux/actions"
import CellTabs from "./cell-tabs";
import "./articles-viewer.css"
import * as utils from './tree-utils';
import store from '../../redux/store';
import * as actions from '../../redux/actions';


class ArticlesViewer extends React.Component {
  componentDidMount() {
    //store.dispatch(actions.addTab({ viewPath: utils.getFirstViewPath(this.props.viewTree), tabId: this.props.match.params.cellId }));
  }

  render() {
    return (
      <ArticlesViewerRecurse {...this.props} />
    )
  }
}

class ArticlesViewerRecurse extends React.PureComponent {
  render() {
    return (
      <div
        key={this.props.view.id}
        className="articles-viewer"
        style={{
          flexFlow: this.props.view.flexFlow,
        }}
      >
        {this.props.view.children.length > 0 ? (
          this.props.view.children.map((_view, index) => (
            <ArticlesViewerRecurse
              key={_view.id}
              view={_view}
              viewPath={[...this.props.viewPath, "children", index]}
              cells={this.props.cells}
            />
          ))
        ) : (
            <div
              key={this.props.view.id}
              className="articles-viewer"
            >
              <CellTabs
                view={this.props.view}
                viewPath={this.props.viewPath}
              />
              {this.props.cells[this.props.view.currTabId] && (
                <Article
                  view={this.props.view}
                  viewPath={this.props.viewPath}
                />
              )}
            </div>
          )}
      </div>
    );
  }
}

ArticlesViewerRecurse.propTypes = {
  view: PropTypes.object.isRequired,
  viewPath: PropTypes.array
};

ArticlesViewerRecurse.defaultProps = {
  viewPath: []
};

export default connect(
  (state) => ({
    cells: state.view.cells,
    viewTree: state.view.viewTree
  }),
  { splitView }
)(ArticlesViewer);