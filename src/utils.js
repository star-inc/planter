// p.mume planter
// (c) 2022 Star Inc.
// License: BSD 3-Clause License
"use strict";

const { sha256 } = require('js-sha256');

function isDataEqual(data1, data2) {
    return sha256(data1) === sha256(data2);
}

function isPropKeyIncludes(object, ...keys) {
    const isInclude = (key) => Object.prototype.hasOwnProperty.call(object, key)
    return keys.map((key) => isInclude(key)).filter((i) => !!i).length > 0;
}

module.exports = {
    isDataEqual,
    isPropKeyIncludes
};
