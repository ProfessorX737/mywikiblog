import React from "react";
import { ReactSortable } from "react-sortablejs";
import PropTypes from "prop-types";

export default function SortableTree(props) {
  const {
    id,
    setNodeList,
    renderNode,
    getChildren,
    getNodeFromId,
    isExpanded,
    dragGroup,
    rootStyle,
    emptyTreeStyle,
    isRoot,
    ...otherProps
  } = props;
  const node = getNodeFromId(id);
  const children = getChildren(node);
  const emptyStyle = children.length === 0 ? { ...emptyTreeStyle } : {};
  return (
    <div key={id} id={id} {...otherProps}>
      {!isRoot && renderNode(node)}
      {(isExpanded(node) || isRoot) && (
        <ReactSortable
          key={node.id}
          id={id}
          group={dragGroup}
          list={children}
          style={{
            marginLeft: isRoot ? "0" : "1em",
            ...rootStyle,
            ...emptyStyle
          }}
          setList={newList => setNodeList(node, newList)}
          {...otherProps}
        >
          {children.map((child, index) => {
            return (
              <SortableTree
                key={child.id}
                id={child.id}
                setNodeList={setNodeList}
                renderNode={renderNode}
                getChildren={getChildren}
                getNodeFromId={getNodeFromId}
                isExpanded={isExpanded}
                isRoot={false}
                dragGroup={dragGroup}
                emptyTreeStyle={emptyTreeStyle}
                {...otherProps}
              />
            );
          })}
        </ReactSortable>
      )}
    </div>
  );
}

SortableTree.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  setNodeList: PropTypes.func.isRequired, // (listId, newList) : void
  renderNode: PropTypes.func.isRequired, // (id) : PropTypes.node
  getChildren: PropTypes.func.isRequired, // (id) : Object[]
  isExpanded: PropTypes.func.isRequired, // (id) : bool
  getNodeFromId: PropTypes.func.isRequired, // (id) : PropTypes.object
  dragGroup: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  rootStyle: PropTypes.object,
  emptyTreeStyle: PropTypes.object,
  isRoot: PropTypes.bool
};

SortableTree.defaultProps = {
  isRoot: true
};
