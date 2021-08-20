const qs = require('../../index')
const expect = require('chai').expect
const request = require('supertest')
const express = require('express')
const app = express()

const custom_options = {
    fields: 'name,age,occupation',
    pagination: 'LIMIT 100 OFFSET 0',
    filters: '',
    sort: 'created_at ASC'
}

app.use(qs(custom_options))

app.get('/', (req, res) => {
    res.status(200).send(req.query)
})

describe('Middleware: Index', function () {
    describe('queryFilter()', function () {
        context('when query is empty', function () {
            it('should return req query as default middleware options', function () {
                return request(app)
                    .get('/')
                    .then(res => validate(res.body, custom_options))
            })
        })
        context('when query is not empty', function () {
            it('should return req query as defined on query string', function () {
                const params = {
                    fields: 'name,age',
                    pagination: 'LIMIT 10 OFFSET 1',
                    filters: 'occupation=developer',
                    sort: 'age DESC'
                }
                return request(app)
                    .get('/?occupation=developer&sort=-age&fields=name,age&limit=10&skip=1')
                    .then(res => validate(res.body, params))
            })
        })
    })
})

function validate(body, params) {
    expect(body).is.not.eql({})
    expect(body.fields).to.eql(params.fields)
    expect(body.filters).to.eql(params.filters)
    expect(body.pagination).to.eql(params.pagination)
    expect(body.sort).to.eql(params.sort)
}
