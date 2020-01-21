function filters(query, options) {
    delete query.sort
    delete query.fields
    delete query.table
    delete query.limit
    delete query.skip
    
    let result = ''
    if (Object.keys(query).length > 0) {
        for (const elem in query) {
            result = result.concat(processQuery(elem, query[elem]).concat('|'))
        }
        result = result.trim().split('|')
        if (result.length > 1) return result.filter(item => item !== '').join(' AND ')
        return result[0]
    }
    return options.filters
}


function processQuery(key, value) {
    key = key.replace(/([^\w\s,.])|(\s{1,})|(^\.{1,})|\.{1,}$/gi, '')
    if (value instanceof Array) return getLogicOperator(key, value.join(','), 'AND')
    if (value.includes(',')) return getLogicOperator(key, value, 'OR')
    return `${key}${treatValue(value)}`
}

function isNumber(value) {
    const toNumber = parseFloat(value)
    return toNumber !== null && `${toNumber}` === value
}

function partialStrings(value) {
    value = value.replace(/(^\*{2,})|\*{2,}$/gi, '*')
    if (value.startsWith('*')) {
        if (value.endsWith('*')) return `LIKE %${value.replace(/([*])/gi, '')}%`
        return `LIKE %${value.replace(/([*])/gi, '')}`
    } else if (value.endsWith('*')) return `LIKE ${value.replace(/([*])/gi, '')}%`
    return `='${value}'`
}

function treatValue(value) {
    if (isNumber(value)) return `=${parseFloat(value)}`
    else {
        if (value.includes('*')) return ` ${partialStrings(value)}`
        else if (value.includes(':')) return `${getCompareOperator(value)}`
        return `=${value}`
    }
}

function getCompareOperator(value) {
    const item = value.split(':')
    const operator = item[0]
    const val = item[1]
    if (operator === 'gte') return `>=${isNumber(val) ? parseFloat(val) : treatValue(val)}`
    else if (operator === 'gt') return `>${isNumber(val) ? parseFloat(val) : treatValue(val)}`
    else if (operator === 'lte') return `<=${isNumber(val) ? parseFloat(val) : treatValue(val)}`
    else if (operator === 'lt') return `<${isNumber(val) ? parseFloat(val) : treatValue(val)}`
    return `=${value}`
}

function getLogicOperator(key, value, op) {
    let result = value.split(',').map(item => `${key}${treatValue(item)}`)
    return `(${result.join(` ${op} `)})`
}

exports = module.exports = {
    filters: filters
}
