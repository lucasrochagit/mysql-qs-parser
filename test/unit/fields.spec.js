const expect = require('chai').expect
const fields = require('../../lib/mapper/fields')


describe('QueryStrings: Fields', function () {
    context('when query fields are a simple string', function () {
        it('should return a string with fields params', function (done) {
            const query = {fields: 'name,age,created_at'}
            verify(fields.fields(query, default_options), 'name,age,created_at')
            done()
        })
    })

    context('when query fields it is an array', function () {
        it('should return a string with fields params', function (done) {
            const query = {fields: ['name,age', 'created_at']}
            verify(fields.fields(query, default_options), 'name,age,created_at')
            done()
        })
    })

    context('when the query fields are empty', function () {
        it('should return a string with default fields params', function (done) {
            const query = {fields: ''}
            verify(fields.fields(query, default_options), default_options.fields)
            done()
        })
    })
})


function verify(fields, expected) {
    expect(fields).to.be.a('string')
    expect(fields).to.eql(expected)
}
