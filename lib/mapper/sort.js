'use strict'

function sort(query, options) {
    var result = ''
    if (query.sort) {
        if (query.sort instanceof Array) {
            result = processQuery(query.sort.join(','))
        } else {
            result = processQuery(query.sort)
        }
        return result
    }
    return options.sort
}

function processQuery(query) {
    query = query.replace(/([^\w\s,-])|(\s{1,})/gi, '')
    const result = query.split(',').map(function (elem) {
        elem = elem.trim()
        if (elem[0] === '-') elem = elem.substr(1).concat(' DESC')
        else elem = elem.concat(' ASC')
        return elem
    })
    return result.join(', ')
}

exports = module.exports = {sort: sort}
