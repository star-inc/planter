const {sha256} = require('js-sha256');

function hashCompare(hash, data) {
    return hash === sha256(data)
}
