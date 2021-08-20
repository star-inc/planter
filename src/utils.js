// p.mume planter
// License: BSD 3-Clause License
// (c) 2021 Star Inc.
const {sha256} = require('js-sha256');

/**
 *
 * @param data1
 * @param data2
 * @returns {boolean}
 */
function hashCompare(data1, data2) {
    return sha256(data1) === sha256(data2)
}

module.exports = {hashCompare}
