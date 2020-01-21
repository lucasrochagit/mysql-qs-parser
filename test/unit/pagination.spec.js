const expect = require('chai').expect
const pagination = require('../../lib/mapper/pagination')


describe('QueryStrings: Pagination', function () {
    context('when query pagination are a simple string', function () {
        it('should return a string with pagination params', function (done) {
            const query = {limit: '10', skip: '1'}
            const expected = 'LIMIT 10 OFFSET 1'
            verify(pagination.pagination(query, default_options), expected)
            done()
        })
    })

    context('when query pagination are a list of string', function () {
        it('should return a string with pagination params with each first param', function (done) {
            const query = {limit: ['10', '20'], skip: ['1', '0']}
            const expected = 'LIMIT 10 OFFSET 1'
            verify(pagination.pagination(query, default_options), expected)
            done()
        })
    })

    context('when query pagination is separated by commas of string', function () {
        it('should return a string with pagination params with each first param', function (done) {
            const query = {limit: '10,20', skip: 'f,0'}
            const expected = 'LIMIT 10 OFFSET 0'
            verify(pagination.pagination(query, default_options), expected)
            done()
        })
    })

    context('when the query does not have pagination', function () {
        it('should return the default pagination string', function (done) {
            const query = { name: 'lucas'}
            verify(pagination.pagination(query, default_options), default_options.pagination)
            done()
        })
    })
})


function verify(pagination, expected) {
    expect(pagination).to.be.a('string')
    expect(pagination).to.eql(expected)
}
