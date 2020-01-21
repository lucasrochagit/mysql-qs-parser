'use strict'

const url = require('url')
const table = require('./mapper/table')
const fields = require('./mapper/fields')
const sort = require('./mapper/sort')
const pagination = require('./mapper/pagination')
const filters = require('./mapper/filters')

function init_default() {
    return {
        pagination: 'LIMIT 100 OFFSET 0',
        fields: '*',
        sort: 'ORDER BY created_at=DESC',
        filters: ''
    }
}

function manage_options(params) {
    const options = init_default()
    if (params.pagination !== undefined) options.pagination = params.pagination
    if (params.fields !== undefined) options.fields = params.fields
    if (params.sort !== undefined) options.sort = params.sort
    if (params.filters !== undefined) options.filters = params.filters
    return options
}

exports = module.exports.parser = function (params) {
    const options = manage_options(params)
    return function (req, res, next) {
        const query = req.query

        const tableName = table.table(query)
        const order = sort.sort(query, options)
        const select = fields.fields(query, options)
        const page = pagination.pagination(query, options)
        const filter = filters.filters(query, options)

        req.query = {
            original: req.url,
            sql_query: `SELECT ${select} FROM ${tableName} ${filter} ${page} ${order};`
        }
        next()
    }
}

exports = module.exports.parseAll = function (query, default_params) {
    const options = manage_options(default_params)
    query = stringToJson(query)

    const tableName = table.table(query)
    const order = sort.sort(query, options)
    const select = fields.fields(query, options)
    const page = pagination.pagination(query, options)
    const filter = filters.filters(query, options)

    return `SELECT ${select} FROM ${tableName} ${filter} ${page} ${order};`

}

exports = module.exports.parseFields = function (query, fields_default) {
    const options = manage_options({fields: fields_default})
    query = stringToJson(query)
    return `SELECT ${fields.fields(query, options)} FROM ${table.table(query)};`
}

exports = module.exports.parseSort = function (query, sort_default) {
    const options = manage_options({sort: sort_default})
    query = stringToJson(query)
    return `SELECT * FROM ${table.table(query)} ${sort.sort(query, options)};`
}

exports = module.exports.parsefilters = function (query, filters_default) {
    const options = manage_options({filters: filters_default})
    query = stringToJson(query)
    return `SELECT * FROM ${table.table(query)} ${filters.filters(query, options)};`
}

exports = module.exports.parsePagination = function (query, pagination_default) {
    const options = manage_options({pagination: pagination_default})
    query = stringToJson(query)
    return `SELECT * FROM ${table.table(query)} ${pagination.pagination(query, options)};`
}

function stringToJson(query) {
    if (typeof query === 'string') return url.parse(query, true).query
    return query
}
