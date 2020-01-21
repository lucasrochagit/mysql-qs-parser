'use strict'
const read = require('./lib/read')

exports = module.exports = function (params) {
    return read.parser(params)
}

exports = module.exports.parser = function (query, _default) {
    return read.parseAll(query, _default)
}

exports = module.exports.parseFields = function (_query, _default) {
    return read.parseFields(_query, _default || '')
}

exports = module.exports.parseSort = function (_query, _default) {
    return read.parseSort(_query, _default || '')
}

exports = module.exports.parsePagination = function (_query, _default) {
    return read.parsePagination(_query, _default || '')
}

exports = module.exports.parseFilter = function (_query, _default) {
    return read.parsefilters(_query, _default || '')
}