import React from "react";
import PropTypes from "prop-types";
import Article from "./article";
import { connect } from "react-redux";
import { 
  splitView,
} from "./redux/actions"
import CellTabs from "./cell-tabs";
import "./articles-viewer.css"

class ArticlesViewer extends React.PureComponent {
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
            <ArticlesViewer
              key={_view.id}
              view={_view}
              viewPath={[...this.props.viewPath, "children", index]}
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
            {/* {this.props.cells[this.props.view.currTabId] && (
              <Article
                view={this.props.view}
                viewPath={this.props.viewPath}
              />
            )} */}
          </div>
        )}
      </div>
    );
  }
}

ArticlesViewer.propTypes = {
  view: PropTypes.object.isRequired,
  viewPath: PropTypes.array
};

ArticlesViewer.defaultProps = {
  viewPath: []
};

export default connect(
  (state) => ({
    cells: state.cells,
    viewTree: state.viewTree
  }),
  { splitView }
)(ArticlesViewer);