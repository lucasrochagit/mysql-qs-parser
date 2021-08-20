const qs = require('../../index')
const expect = require('chai').expect

describe('QueryStrings: Index', function () {
    describe('buildSql()', function () {
        context('when want to build a query string based on query parameters', function () {
            it('should return a sql string', function (done) {
                const table = 'users'
                const expected = 'SELECT * FROM users LIMIT 100 OFFSET 0;'
                validate(qs.buildSql(table, default_options), expected, 'string')
                done()
            })
        })

        context('when parse custom options', () => {
            it('should return a sql string', function (done) {
                const table = 'users'
                const expected = 'SELECT * FROM users WHERE name LIKE %uc%;'
                validate(qs.buildSql(table, {filters: 'name LIKE %uc%'}), expected, 'string')
                done()
            })
        })
    })

    describe('parseFilter()', function () {
        context('when want to parse a query filter to sql', function () {
            it('should return a sql string', function (done) {
                const query = '?name=jorge'
                const expected = 'name=jorge'
                validate(qs.parseFilter(query, default_options.filters), expected, 'string')
                done()
            })

            it('should return a sql string', function (done) {
                const query = {name: 'jorge'}
                const expected = 'name=jorge'
                validate(qs.parseFilter(query, ''), expected, 'string')
                done()
            })
        })
    })

    describe('parsePagination()', function () {
        context('when want to parse a query pagination to sql', function () {
            it('should return a sql string', function (done) {
                const query = '?limit=10&skip=0'
                const expected = 'LIMIT 10 OFFSET 0'
                validate(qs.parsePagination(query, default_options.pagination), expected, 'string')
                done()
            })
            it('should return a sql string', function (done) {
                const query = {limit: '10', skip: '0'}
                const expected = 'LIMIT 10 OFFSET 0'
                validate(qs.parsePagination(query, ''), expected, 'string')
                done()
            })
        })
    })

    describe('parseSort()', function () {
        context('when want to parse a query sort to sql', function () {
            it('should return a sql string', function (done) {
                const query = '?sort=name,-age'
                const expected = 'name ASC, age DESC'
                validate(qs.parseSort(query, default_options.sort), expected, 'string')
                done()
            })
            it('should return a sql string', function (done) {
                const query = {sort: 'name,-age'}
                const expected = 'name ASC, age DESC'
                validate(qs.parseSort(query, ''), expected, 'string')
                done()
            })
        })
    })

    describe('parseFields()', function () {
        context('when want to parse a query fields to sql', function () {
            it('should return a sql string', function (done) {
                const query = '?fields=name,age'
                const expected = 'name,age'
                validate(qs.parseFields(query, default_options.fields), expected, 'string')
                done()
            })
            it('should return a sql string', function (done) {
                const query = {fields: 'name,age'}
                const expected = 'name,age'
                validate(qs.parseFields(query, ''), expected, 'string')
                done()
            })
        })
    })

    describe('parser()', function () {
        context('when want to parse a query  to sql', function () {
            it('should return a sql string', function (done) {
                const query = '?fields=name,age&sort=-age&limit=10&skip=1&name=*Lu'
                const expected = {
                    original: query,
                    pagination: 'LIMIT 10 OFFSET 1',
                    fields: 'name,age',
                    sort: 'age DESC',
                    filters: 'name LIKE %Lu'
                }
                validate(qs.parser(query, default_options.fields), expected, 'object')
                done()
            })
        })
    })

    describe('qs()', function () {
        context('when instance the class without default params', function () {
            it('should do something', function (done) {
                const any = qs({})
                console.log
                done()
            })
        })
    })
})

function validate(sql, expected, type) {
    expect(sql).to.be.a(type)
    expect(sql).to.eql(expected)
}
