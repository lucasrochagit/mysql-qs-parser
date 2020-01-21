function filters(query, options) {
    delete query.sort
    delete query.fields
    delete query.limit
    delete query.skip

    let result = ''
    if (Object.keys(query).length > 0) {
        for (const elem in query) {
            result = result.concat(processQuery(elem, query[elem]).concat('|'))
        }
        result = result.trim().split('|')
        if (result.length > 1 && result[1]) return result.filter(item => item !== '').join(' AND ')
        else return result[0]
    }
    return options.filters
}


function processQuery(key, value) {
    key = key.replace(/([^\w\s,.])|(\s{1,})|(^\.{1,})|\.{1,}$/gi, '')
    if (value instanceof Array) return getLogicOperator(key, value.join('|'), 'AND')
    if (value.includes(',')) return getLogicOperator(key, value, 'OR')
    return `${key}${treatValue(value)}`
}

function isNumber(value) {
    const toNumber = parseFloat(value)
    if (!toNumber) return false
    if (isDouble(value)) return `${parseDouble(value)}` === value
    return `${toNumber}` === value
}

function parseDouble(value) {
    const decimal = value.split('.')
    return parseFloat(value).toFixed(decimal[1].length)
}

function isDouble(value) {
    value = value.split('.')
    return value[0] && value[1]
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
    if (isNumber(value)) {
        if (isDouble(value)) return `=${parseDouble(value)}`
        return `=${parseFloat(value)}`
    } else {
        if (value.includes('*')) return ` ${partialStrings(value)}`
        else if (value.includes(':')) return `${getCompareOperator(value)}`
        return `=${value}`
    }
}

function getCompareOperator(value) {
    const item = value.split(':')
    const operator = item[0]
    let val = item[1]
    if (isNumber(val)) {
        if (isDouble(val)) val = parseDouble(val)
        else parseFloat(val)
    } else {
        val = treatValue(val)
    }
    if (val.startsWith('=')) val = val.substr(1)
    if (operator === 'gte') return `>=${val}`
    else if (operator === 'gt') return `>${val}`
    else if (operator === 'lte') return `<=${val}`
    else if (operator === 'lt') return `<${val}`
    return `=${value}`
}

function getLogicOperator(key, value, op) {
    let result
    if (op === 'AND') {
        result = value.split('|').map(item => {
            return item.includes(',') ? getLogicOperator(key, item, 'OR') : `${key}${treatValue(item)}`
        })
    } else {
        result = value.split(',').map(item => `${key}${treatValue(item)}`)
    }
    return `(${result.join(` ${op} `)})`
}

exports = module.exports = {
    filters: filters
}
