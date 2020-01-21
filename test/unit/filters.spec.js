const expect = require('chai').expect
const filters = require('../../lib/mapper/filters')


describe('QueryStrings: Filters', function () {
    context('when query filters are a simple string', function () {
        it('should return a string with filters params', function (done) {
            const query = {name: 'lucas', age: '30', occupation: 'developer', salary: '4999.99'}
            const expected = 'name=lucas AND age=30 AND occupation=developer AND salary=4999.99'
            verify(filters.filters(query, default_options), expected)
            done()
        })
    })

    context('when query filters are a unique param on string', function () {
        it('should return a string with filters params', function (done) {
            const query = {age: '30f'}
            const expected = 'age=30f'
            verify(filters.filters(query, default_options), expected)
            done()
        })
    })

    context('when query does not contains filters', function () {
        it('should return a string with default fields params', function (done) {
            const query = {fields: 'name,age'}
            verify(filters.filters(query, default_options), default_options.filters)
            done()
        })
    })

    context('when query filters it is an array', function () {
        it('should return a string with filters params', function (done) {
            const query = {name: ['lucas,jose', 'matthew']}
            const expected = '((name=lucas OR name=jose) AND name=matthew)'
            verify(filters.filters(query, default_options), expected)
            done()
        })
    })

    context('when query filters contains multiple values for the same key', function () {
        it('should return a string with filters params', function (done) {
            const query = {name: 'lucas,jose,matthew'}
            const expected = '(name=lucas OR name=jose OR name=matthew)'
            verify(filters.filters(query, default_options), expected)
            done()
        })
    })

    context('when the query filter is a compare operator', function () {
        it('should return a string with filters params', function (done) {
            const query = {age: ['gt:30', 'lte:50'], salary: ['gte:4000.00', 'lt:5000.00']}
            const expected = '(age>30 AND age<=50) AND (salary>=4000.00 AND salary<5000.00)'
            verify(filters.filters(query, default_options), expected)
            done()
        })
        it('should return a string with filters params when param is string', function (done) {
            const query = {name: 'gt:car'}
            const expected = 'name>car'
            verify(filters.filters(query, default_options), expected)
            done()
        })
        it('should return the filter param when does not follow the compare operator pattern', function (done) {
            const query = {age: 'gtt:30'}
            const expected = 'age=gtt:30'
            verify(filters.filters(query, default_options), expected)
            done()
        })
    })

    context('when the query filter is a partial string', function () {
        it('should return a string with filter params', function (done) {
            const query = {name: '*Carl', occupation: 'Developer*', language: '*pt*'}
            const expected = 'name LIKE %Carl AND occupation LIKE Developer% AND language LIKE %pt%'
            verify(filters.filters(query, default_options), expected)
            done()
        })

        it('should return a string when the partial stirng are incorrect', function (done) {
            const query = { name: 'ca**rl'}
            const expected = 'name =\'ca**rl\''
            verify(filters.filters(query, default_options), expected)
            done()
        })
    })
})


function verify(filters, expected) {
    expect(filters).to.be.a('string')
    expect(filters).to.eql(expected)
}
