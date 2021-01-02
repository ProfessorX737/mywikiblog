import update from "immutability-helper";

/**
 * Turn an array of keys into a nested object of keys
 * @param {numer[]|string[]} path
 */
export function unflatten(path) {
  let obj = {};
  let lastObj = path.reduce((accum, key) => {
    let next = {};
    accum[key] = next;
    return next;
  }, obj);
  return { obj, lastObj };
}

/**
 * Change the node's specified attribute at the path specified
 * @param {Object} params
 * @param {!Object[]}  params.treeData
 * @param {number[]|string[]} params.path - array of keys specifying location of node
 * @param {number|string} params.attrKey - the node's attribute to change
 * @param newAttrVal - new value assigned to the node's attrKey at path
 * @return {Object} - altered treeData
 */
export function changeNodeAttrAtPath({ treeData, path, attrKey, newAttrVal }) {
  let { obj, lastObj } = unflatten(path);
  lastObj[attrKey] = { $set: newAttrVal };
  return update(treeData, obj);
}

/**
 * Do an update like from immutability-helper but at the path specified
 * @param {Object} params
 * @param {!Object[]}  params.treeData
 * @param {number[]|string[]} params.path - array of keys specifying location of node
 * @param {Object} params.update - update tree object same as immutability-helper update
 * @return {Object} - altered treeData
 */
export function updateAtPath({ treeData, path, update }) {
  if(path.length === 0) {
    return update(treeData, update);
  }
  const _path = [...path];
  const lastIndex = _path.pop();
  let { obj, lastObj } = unflatten(_path);
  lastObj[lastIndex] = update;
  return update(treeData, obj);
}

export function getUpdateAtPathOb({ path, update }) {
  if(path.length === 0) {
    return update;
  }
  const _path = [...path];
  const lastIndex = _path.pop();
  let { obj, lastObj } = unflatten(_path);
  lastObj[lastIndex] = update;
  return obj;
}

/**
 * Set the node specified at path with a new node
 * @param {Object} params
 * @param {!Object[]}  params.treeData
 * @param {number[]|string[]} params.path - array of keys specifying location of node to set
 * @param {Object}  params.newNode - the new node to set
 * @return {Object} - altered treeData
 */
export function changeNodeAtPath({ treeData, path, newNode }) {
  let { obj, lastObj } = unflatten(path);
  lastObj["$set"] = newNode;
  return update(treeData, obj);
}

/**
 * Remove the node at the path specified
 * @param {Object} params
 * @param {!Object[]}  params.treeData
 * @param {number[]|string[]} params.path - array of keys specifying location of node
 * @return {Object} - altered treeData
 */
export function removeListItemAtPath({ treeData, path }) {
  const _path = [...path];
  const lastIndex = _path.pop();
  let { obj, lastObj } = unflatten(_path);
  lastObj["$splice"] = [[lastIndex, 1]];
  return update(treeData, obj);
}

/**
 * insert a node after the specified node at path
 * @param {Object} params
 * @param {!Object[]}  params.treeData
 * @param {number[]|string[]} params.path - array of keys specifying location of node
 * @param {Object}  params.newNode - the new node to insert
 * @return {Object} - altered treeData
 */
export function insertAfterListItemAtPath({ treeData, path, newNode }) {
  const _path = [...path];
  const lastIndex = _path.pop();
  let { obj, lastObj } = unflatten(_path);
  lastObj["$splice"] = [[lastIndex + 1, 0, newNode]];
  return update(treeData, obj);
}

export function getValAtPath({ treeData, path }) {
  let next = treeData;
  for (let i = 0; i < path.length; i++) {
    next = next[path[i]];
    if (next === undefined) return next;
  }
  return next;
}
