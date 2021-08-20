'use strict'

const url = require('url')
const fields = require('./mapper/fields')
const sort = require('./mapper/sort')
const pagination = require('./mapper/pagination')
const filters = require('./mapper/filters')

function init_default() {
    return {
        pagination: 'LIMIT 100 OFFSET 0',
        fields: '*',
        sort: '',
        filters: ''
    }
}

function manage_options(params) {
    if (!params) params = {}
    const options = init_default()
    if (params.pagination !== undefined) options.pagination = params.pagination
    if (params.fields !== undefined) options.fields = params.fields
    if (params.sort !== undefined) options.sort = params.sort
    if (params.filters !== undefined) options.filters = params.filters
    return options
}

exports = module.exports.parser = function (params) {
    const options = manage_options(params)
    return function (req, _, next) {
        const query = req.query

        const order = sort.sort(query, options)
        const select = fields.fields(query, options)
        const page = pagination.pagination(query, options)
        const filter = filters.filters(query, options)

        req.query = {
            pagination: page,
            fields: select,
            sort: order,
            filters: filter
        }
        next()
    }
}

exports = module.exports.parseAll = function (query, default_params) {
    const options = manage_options(default_params)
    const original = query
    query = stringToJson(query)

    const order = sort.sort(query, options)
    const select = fields.fields(query, options)
    const page = pagination.pagination(query, options)
    const filter = filters.filters(query, options)
    return {
        original,
        pagination: page,
        fields: select,
        sort: order,
        filters: filter
    }
}

exports = module.exports.parseFields = function (query, fields_default) {
    const options = manage_options({fields: fields_default})
    query = stringToJson(query)
    return fields.fields(query, options)
}

exports = module.exports.parseSort = function (query, sort_default) {
    const options = manage_options({sort: sort_default})
    query = stringToJson(query)
    return sort.sort(query, options)
}

exports = module.exports.parseFilter = function (query, filters_default) {
    const options = manage_options({filters: filters_default})
    query = stringToJson(query)
    return filters.filters(query, options)
}

exports = module.exports.parsePagination = function (query, pagination_default) {
    const options = manage_options({pagination: pagination_default})
    query = stringToJson(query)
    return pagination.pagination(query, options)
}

exports = module.exports.buildSql = function (tableName, options) {
    return `SELECT ${options.fields || '*'}` +
        ` FROM ${tableName}` +
        `${options.filters ? ` WHERE ${options.filters}` : ''}` +
        `${options.pagination ? ` ${options.pagination}` : ''}` +
        `${options.sort ? ` ORDER BY ${options.sort}` : ''};`
}

function stringToJson(query) {
    if (typeof query === 'string') return url.parse(query, true).query
    return query
}
