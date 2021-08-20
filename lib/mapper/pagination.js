'use strict'

function pagination(query, options) {
    const result = []
    let limit = options.pagination.split(' ')[1] || 100
    let offset = options.pagination.split(' ')[3] || 0

    if (query.limit) {
        limit = processQuery(processParams(query.limit))
    }
    if (query.page) {
        let page = processQuery(processParams(query.page))
        if (page < 1) page = 1
        offset = (page - 1) * limit
    } else if (query.skip) {
        offset = processQuery(processParams(query.skip))
    }
1
    result.push(`LIMIT ${limit}`)
    result.push(`OFFSET ${offset}`)

    if (result.length > 0) return result.join(' ')
    return options.pagination
}

function processQuery(query) {
    query = query.replace(/([^\w\s,.])|(\s{1,})|(^\.{1,})|\.{1,}$/gi, '')
    return isInteger(query) ? parseInt(query) : 0
}

exports = module.exports = {pagination: pagination}

function isInteger(value) {
    const toInt = parseInt(value, 10)
    return toInt !== null && `${toInt}` === value
}

function processParams(param) {
    if (param.includes(',')) return param.split(',')[0]
    if (param instanceof Array) return param[0]
    return param
}
