"use strict";

import pick from "lodash/pick.js";

const getInfoData = ({ fields = [], object = {} }) => {
  return pick(object, fields);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((field) => [field, 1]));
}

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((field) => [field, 0]));
}

const removeUndefinedObject = obj => {
  Object.keys(obj).forEach(k => {
    if (obj[k] == null) {
      delete obj[k];
    }
  })

  return obj;
}

const updateNestedObjectParer = obj => {
  const final = {}
  Object.keys(obj).forEach(k => {
    if (typeof obj[k] === 'object' && !Array.isArray(obj[k]) && obj[k] !== null) {
      const response = updateNestedObjectParer(obj[k])
      Object.keys(response).forEach(a => {
        final[`${k}.${a}`] = response[a]
      })
    } else {
      if (obj[k] != null) {
        final[k] = obj[k]
      }
    }
  })
  return final
}

export {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefinedObject,
  updateNestedObjectParer
}