# mysql-qs-parser

Middleware to transform query strings in a format that is recognized by the MySQL.

# Prerequisites

It is recommended that your application use express.js or hapi.js frameworks (or frameworks that use them) for the
middleware to work correctly. Tests with other frameworks were not performed.

# Installing

Use the follow command:

`npm i --save query-strings-parser`

# Usage Examples

## Using default configuration

```js
const express = require('express');
const qs = require('mysql-qs-parser');

const app = express();

app.use(qs());

app.get('/', (req, res) => {
    res.send({query: req.query});
});

app.listen(8080, () => console.log('app listening on port 8080'));

/**
 * Request: GET http://localhost:8080
 * Response:
 {
    "query": {
        "pagination": "LIMIT 100 OFFSET 0",
        "fields": "*",
        "sort": "created_at=DESC",
        "filters": ""
    }
}
 */

/**
 * Request: GET http://localhost:8080?limit=10&page=2&sort=-name&
 * Response:
 {
    "query": {
        "pagination": "LIMIT 100 OFFSET 0",
        "fields": "*",
        "sort": "created_at=DESC",
        "filters": ""
    }
}
 */

```

