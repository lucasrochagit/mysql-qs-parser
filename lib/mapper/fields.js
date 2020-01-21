'use strict'

function fields(query, options) {
    let result = ''
    if (query.fields) {
        if (query.fields instanceof Array) {
            result = processQuery(query.fields.join(','))
        } else {
            result = processQuery(query.fields)
        }
        return result
    }
    return options.fields
}

function processQuery(query) {
    query = query.replace(/([^\w\s,.])|(\s{1,})|(^\.{1,})|\.{1,}$/gi, '')
    return query
}

exports = module.exports = {fields: fields}
