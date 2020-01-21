const expect = require('chai').expect
const sort = require('../../lib/mapper/sort')


describe('QueryStrings: Sort', function () {
    context('when query sort are a simple string', function () {
        it('should return a string with sort params', function (done) {
            const query = {sort: 'name,-age,-created_at'}
            const expect = 'name ASC, age DESC, created_at DESC'
            verify(sort.sort(query, default_options), expect)
            done()
        })
    })

    context('when query sort are a array of string', function () {
        it('should return a string with sort params', function (done) {
            const query = {sort: ['name,-age', '-created_at']}
            const expect = 'name ASC, age DESC, created_at DESC'
            verify(sort.sort(query, default_options), expect)
            done()
        })
    })

    context('when the query does not contains sort', function () {
        it('should return the default sort param', function (done) {
            const query = {fields: 'name,age'}
            verify(sort.sort(query, default_options), default_options.sort)
            done()
        })
    })
})


function verify(sort, expected) {
    expect(sort).to.be.a('string')
    expect(sort).to.eql(expected)
}
