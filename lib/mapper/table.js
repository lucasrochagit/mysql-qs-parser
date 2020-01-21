'use strict'

function table(query) {
    let result = ''
    if (query.table) {
        if (query.sort instanceof Array) {
            result = processQuery(query.table.join(','))
        } else {
            result = processQuery(query.table)
        }
        return result
    }
}

function processQuery(query) {
    query = query.replace(/([^\w\s,-,(,)])|(\s{1,})/gi, '')
    const result = query.split(',').map(item => {
        if (item.includes('(')) {
            const value = item.split('(')
            return value[0].concat(` AS  ${value[1].substr(0, value[1].length - 1)}`)
        }
        return item
    })
    return result.join(', ')
}

exports = module.exports = {table: table}
