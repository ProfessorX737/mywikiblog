import React from "react";
import "./sortable-tabs.css";
import { ReactSortable } from "react-sortablejs";
import PropTypes from "prop-types";
import Close from "@material-ui/icons/Close";
import Add from "@material-ui/icons/Add";
import { Scrollbars } from "react-custom-scrollbars";
import update from "immutability-helper";
import clsx from "clsx";
import MoreVert from "@material-ui/icons/MoreVert";

export default class SortableTabs extends React.Component {
  constructor(props) {
    super(props);
    this.myrefs = {};
    this.dummyTabId = -1;
    this.tabIdCount = {};
  }
  changeTab = tabId => {
    if (this.props.currTabId !== tabId) {
      this.props.setTabsView({ currTabId: tabId });
      this.props.onTabChange(tabId);
    }
  };
  handleTabClose = tabIndex => {
    const id = this.props.tabs[tabIndex].id;
    // the tab to be closed is the current tab
    let newCurrTabId = undefined;
    if (id === this.props.currTabId) {
      if (this.props.tabs.length === 1) {
        this.props.onLastTabClose();
      } else {
        const inc = tabIndex === this.props.tabs.length - 1 ? -1 : 1;
        newCurrTabId = this.props.tabs[tabIndex + inc].id;
      }
    }
    // if the tab closed is a dummy tab delete it from the refs
    // so that the refs func recognizes new dummy tab and does the callbacks
    if (id === this.dummyTabId) {
      delete this.myrefs[`tab${id}`];
    }
    this.props.setTabsView({
      tabs: update(this.props.tabs, { $splice: [[tabIndex, 1]] }),
      currTabId: newCurrTabId
    });
  };
  setDummyTab = newTab => {
    for (let i = 0; i < this.props.tabs.length; i++) {
      if (this.props.tabs[i].id === this.dummyTabId) {
        this.props.setTabsView({
          tabs: update(this.props.tabs, { [i]: { $set: newTab } })
        });
      }
    }
  };
  setTabRef = (el, tabId) => {
    const key = `tab${tabId}`;
    if (this.myrefs[key] === undefined && el) {
      el.scrollIntoView();
      this.myrefs[key] = el;
      if (tabId === this.dummyTabId) {
        // the ref is a dummy tab and its our first time seeing it
        this.props.onNewDummyTab(this.dummyTabId, this.setDummyTab);
        this.changeTab(tabId);
      }
    }
  };
  handleSort = evt => {
    if (evt.pullMode) {
      if (evt.to === this.myrefs["sortable-tabs"]) {
        // a tab was dropped in from another list
        const id = this.props.tabs[evt.newIndex].id;
        this.changeTab(id);
      } else if (evt.from === this.myrefs["sortable-tabs"]) {
        // a tab was dropped into another list
        if (this.props.tabs.length === 0) {
          this.props.onLastTabClose();
        } else {
          const inc = evt.oldIndex === this.props.tabs.length ? -1 : 0;
          const ntab = this.props.tabs[evt.oldIndex + inc];
          this.changeTab(ntab.id);
        }
      }
    }
  };
  getTabKey = tabId => {
    let count = this.tabIdCount[tabId];
    count = Boolean(count) ? count + 1 : 1;
    this.tabIdCount[tabId] = count;
    return `${tabId}_${count}`;
  };
  render() {
    const {
      ref,
      list,
      setList,
      className,
      filter,
      group,
      onSort,
      ...sortableJsProps
    } = this.props.sortableJsProps || {};
    // reset tabIdCount to an empty dictionary
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
        style={this.props.style}
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
            list={this.props.tabs}
            setList={tabs => this.props.setTabsView({ tabs: tabs })}
            className="sortable-tabs"
            filter=".dummy-tab"
            group={this.props.dragGroup}
            onSort={evt => {
              this.handleSort(evt);
              if (onSort) onSort(evt);
            }}
            {...sortableJsProps}
          >
            {this.props.tabs.map((tab, index) => {
              const key = this.getTabKey(tab.id);
              return (
                <div
                  ref={el => {
                    this.setTabRef(el, tab.id);
                  }}
                  key={key}
                  id={tab.id}
                  className={clsx(
                    tab.id === this.props.currTabId
                      ? "sel-article-tab"
                      : "article-tab",
                    tab.id < 0 && ".dummy-tab"
                  )}
                  onClick={() => {
                    this.changeTab(tab.id);
                    this.myrefs[`tab${tab.id}`].scrollIntoView();
                  }}
                >
                  {this.props.renderTabContent(tab)}
                  <div className="close-tab-btn-wrapper">
                    <div
                      className="close-tab-btn"
                      onClick={e => {
                        e.stopPropagation();
                        this.handleTabClose(index);
                      }}
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
          onClick={() => {
            // check to see if there is dummy tab already, if so focus it and return
            for (let i = 0; i < this.props.tabs.length; i++) {
              if (this.props.tabs[i].id === this.dummyTabId) {
                this.changeTab(this.dummyTabId);
                this.myrefs[`tab${this.dummyTabId}`].scrollIntoView();
                return;
              }
            }
            // add a new dummy tab
            // changeTab should only be called after update has finished
            this.props.setTabsView({
              tabs: update(this.props.tabs, {
                $push: [{ id: this.dummyTabId }]
              })
            });
          }}
        >
          <Add fontSize="small" />
        </div>
        <div className="more-btn" onClick={this.props.handleMoreClick}>
          <MoreVert fontSize="small" />
        </div>
      </div>
    );
  }
}

SortableTabs.propTypes = {
  tabs: PropTypes.array.isRequired,
  currTabId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  setTabsView: PropTypes.func.isRequired, // ({tabs, currTabId}) => {} : void
  renderTabContent: PropTypes.func, // tab => HTMLElement
  onTabChange: PropTypes.func, // (tabId) => {} : void
  onLastTabClose: PropTypes.func,
  onNewDummyTab: PropTypes.func, // (setNewTab: function) : void
  handleMoreClick: PropTypes.func, // () : void
  dragGroup: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  style: PropTypes.object,
  sortableJsProps: PropTypes.object
};

SortableTabs.defaultProps = {
  renderTabContent: tab => {
    return (
      <div style={{ whiteSpace: "nowrap", minWidth: "100px" }}>
        {tab.content}
      </div>
    );
  },
  onTabChange: tabId => {},
  onNewDummyTab: (dummyTabId, setNewTab) => {},
  onLastTabClose: () => {},
  handleMoreClick: () => {},
  style: {}
};
