'use strict'

function pagination(query, options) {
    const result = []

    if (query.limit) {
        if (query.limit.includes(',')) query.limit = query.limit.split(',')
        if (query.limit instanceof Array) result.push(`LIMIT ${processQuery(query.limit[0])}`)
        else result.push(`LIMIT ${processQuery(query.limit)}`)
    }

    if (query.skip) {
        if (query.skip.includes(',')) query.skip = query.skip.split(',')
        if (query.skip instanceof Array) result.push(`OFFSET ${processQuery(query.skip[0])}`)
        else result.push(`OFFSET ${processQuery(query.skip)}`)
    }
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