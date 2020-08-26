import React from "react";
import "./sortable-tabs.css";
import { ReactSortable } from "react-sortablejs";
import PropTypes from "prop-types";
import Close from "@material-ui/icons/Close";
import Add from "@material-ui/icons/Add";
import { Scrollbars } from "react-custom-scrollbars";
import clsx from "clsx";
import { connect } from "react-redux";
import {
  changeTab,
  setTabs,
  setTabView,
  closeTab
} from "./redux/actions"
import assert from "assert"
import ViewOptions from "./view-options"

class CellTabs extends React.Component {

  constructor(props) {
    super(props);
    this.myrefs = {};
    this.tabIdCount = {};
  }

  onChangeTab = tabId => {
    if (this.props.view.currTabId !== tabId) {
      this.props.changeTab({
        viewPath: this.props.viewPath,
        tabId
      })
    }
  };

  setTabRef = (el, tabId) => {
    const key = `tab${tabId}`;
    if (this.myrefs[key] === undefined && el) {
      el.scrollIntoView();
      this.myrefs[key] = el;
    }
  };

  handleSort = evt => {
    if (evt.pullMode) {
      if (evt.to === this.myrefs["sortable-tabs"]) {
        // a tab was dropped in from another list
        const id = this.props.view.tabs[evt.newIndex].id;
        this.onChangeTab(id);
      } else if (evt.from === this.myrefs["sortable-tabs"]) {
        // a tab was dropped into another list
        if (this.props.view.tabs.length === 0) {
          this.onChangeTab(0);
        } else {
          const inc = evt.oldIndex === this.props.view.tabs.length ? -1 : 0;
          const ntab = this.props.view.tabs[evt.oldIndex + inc];
          this.onChangeTab(ntab.id);
        }
      }
    }
  };

  // to prevent jsx from complaining about duplicate element keys
  // append the count of the id to the id
  getTabKey = tabId => {
    let count = this.tabIdCount[tabId];
    count = Boolean(count) ? count + 1 : 1;
    this.tabIdCount[tabId] = count;
    return `${tabId}_${count}`;
  };

  onSetTabs = newTabs => {
    try {
      assert.deepEqual(this.props.view.tabs, newTabs);
    } catch(e) {
      this.props.setTabs({
        viewPath: this.props.viewPath,
        newTabs
      })
    }
  }

  /**
   * For the sortableJs prop in SortableTabs: setData
   * @param {Object} dataTransfer - CustomEvent from sortablejs
   * @param {HTMLElement} - el
   */
  handleDataOnDrag = (dataTransfer, el) => {
    // if tab is dragged to another sortable tabs instance add it
    const tabId = el.getAttribute("id");
    const tabView = { [tabId]: this.props.view.tabsView[tabId] };
    if (Boolean(tabView[tabId])) {
      dataTransfer.setData("tabView", JSON.stringify(tabView));
    }
  };
  /**
   * For the sortableJs prop in SortableTabs: onAdd
   * This acts as the recipient function for the dataTransfer between sortablejs objects
   * Grab the tabsView data from sortablejs sender when it used setData
   * @param {Object} evt - CustomEvent from sortablejs
   */
  handleTabAdd = evt => {
    // grab the tab view data passed from the other sortable tabs instance and add it to our local state
    const tabViewJson = evt.originalEvent.dataTransfer.getData("tabView");
    if (Boolean(tabViewJson)) {
      const tabView = JSON.parse(tabViewJson);
      this.props.setTabView({
        viewPath: this.props.viewPath,
        tabView
      })
    }
  };

  /**
   * For SortableTabs prop renderTabContent
   * @param {Object} tab - tab data
   * @param {Number|String} tab.id - tab id
   * @returns {HTMLElement} - the tab element
   */
  renderTabContent = tab => {
    const content = this.props.cells[tab.id]?.content;
    return (
      <div style={{ whiteSpace: "nowrap", minWidth: "100px" }}>{content}</div>
    );
  };

  onCloseTab = (evt, tabId, tabIndex) => {
    evt.stopPropagation();
    this.props.closeTab({
      view: this.props.view,
      viewPath: this.props.viewPath,
      tabId,
      tabIndex
    })
  }

  render() {
    this.tabIdCount = {};
    return (
      <div
        className="sortable-tabs-toolbar"
        onWheel={e => {
          e.stopPropagation();
          const delta = this.myrefs.scrollbar.getScrollLeft();
          this.myrefs["scrollbar"].scrollLeft(delta + e.deltaY);
          return false;
        }}
      >
        <Scrollbars
          ref={el => {
            this.myrefs["scrollbar"] = el;
          }}
          style={{ height: "2.1em" }}
          autoHide
        >
          <ReactSortable
            ref={el => {
              this.myrefs["sortable-tabs"] = el?.ref?.current;
            }}
            list={this.props.view.tabs}
            setList={tabs => {this.onSetTabs(tabs)}}
            className="sortable-tabs"
            // filter=".dummy-tab"
            onSort={evt => { this.handleSort(evt) }}
            setData={this.handleDataOnDrag}
            onAdd={this.handleTabAdd}
            group={{
              name: "tabs",
              put: ["cells", "tabs"],
              pull: (to, from) => {
                if (to.options.group.name === "cells") {
                  return "clone";
                } else if (to.options.group.name === "tabs") {
                  return true;
                }
                return false;
              }
            }}
          >
            {this.props.view.tabs.map((tab, index) => {
              const key = this.getTabKey(tab.id);
              return (
                <div
                  ref={el => {
                    this.setTabRef(el, tab.id);
                  }}
                  key={key}
                  id={tab.id}
                  className={clsx(
                    tab.id === this.props.view.currTabId
                      ? "sel-article-tab"
                      : "article-tab"
                  )}
                  onClick={() => {
                    this.onChangeTab(tab.id);
                    this.myrefs[`tab${tab.id}`].scrollIntoView();
                  }}
                >
                  {this.renderTabContent(tab)}
                  <div className="close-tab-btn-wrapper">
                    <div
                      className="close-tab-btn"
                      onClick={evt => {this.onCloseTab(evt, tab.id, index)}}
                    >
                      <Close
                        style={{
                          fontSize: "14px",
                          borderRadius: "10px"
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </ReactSortable>
        </Scrollbars>
        <div
          className="add-tab-btn"
          onClick={() => {}}
        >
          <Add fontSize="small" />
        </div>
        <ViewOptions
          view={this.props.view}
          viewPath={this.props.viewPath}
        />
      </div>
    );
  }
}

CellTabs.propTypes = {
  view: PropTypes.object.isRequired,
  viewPath: PropTypes.array.isRequired
};

export default connect(
  state => ({ cells: state.cells }), 
  {
    changeTab,
    setTabs,
    setTabView,
    closeTab
  }
)(CellTabs)
