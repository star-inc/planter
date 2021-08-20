const {sha256} = require('js-sha256');

function hashCompare(data1, data2) {
    return sha256(data1) === sha256(data2)
}

module.exports = {hashCompare}
