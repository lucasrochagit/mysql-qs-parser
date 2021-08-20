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
    res.send({query: req.query, sql: qs.buildSql('users', req.query)});
});

app.listen(8080, () => console.log('app listening on port 8080'));

/**
 * Request: GET http://localhost:8080
 * Response:
 {
    "query": {
        "pagination": "LIMIT 100 OFFSET 0",
        "fields": "*",
        "sort": "",
        "filters": ""
    },
    "sql": "SELECT * FROM users LIMIT 100 OFFSET 0;"
}
 */

/**
 * Request: GET http://localhost:8080/?limit=10&page=2&sort=-name&fields=name,age&name=*A
 * Response:
{
    "query": {
        "pagination": "LIMIT 10 OFFSET 10",
        "fields": "name,age",
        "sort": "name DESC",
        "filters": "name LIKE %A"
    },
    "sql": "SELECT name,age FROM users WHERE name LIKE %A LIMIT 10 OFFSET 10 ORDER BY name DESC;"
}
 */

```

## Using custom configuration

```js
const express = require('express');
const qs = require('mysql-qs-parser');

const app = express();

app.use(qs({
    sort: 'created_at ASC',
    pagination: 'LIMIT 10 OFFSET 0'
}));

app.get('/', (req, res) => {
    res.send({query: req.query, sql: qs.buildSql('users', req.query)});
});

app.listen(8080, () => console.log('app listening on port 8080'));

/**
 * Request: GET http://localhost:8080
 * Response:
{
    "query": {
        "pagination": "LIMIT 10 OFFSET 0",
        "fields": "*",
        "sort": "created_at ASC",
        "filters": ""
    },
    "sql": "SELECT * FROM users LIMIT 10 OFFSET 0 ORDER BY created_at ASC;"
}
 */

```

# Available Functions

## `parser()`

The library has a function that transform query strings into query objects, in the format defined by the library. You can
also pass custom settings, to mount the query object, as well as in the library instance as middleware.

Note: To work as expected, it is necessary to inform the query with the question mark at the beginning, as if it were to
inform a GET request. Example: `?name=*A`

If you enter without the question mark (as `name=*A`), the function will not identify your query string, and will return
a query object with default values (or custom values, if you enter them).

Example:

```js
const qs = require('mysql-qs-parser');

console.log('Default options:', qs.parser('?sort=-name&fields=name,age&name=*A'))
console.log('Custom options:', qs.parser('?sort=-name&fields=name,age&name=*A', { pagination: 'LIMIT 10 OFFSET 0'}))

/*
    Default options: {
        original: '?sort=-name&fields=name,age&name=*A',
        pagination: 'LIMIT 100 OFFSET 0',
        fields: 'name,age',
        sort: 'name DESC',
        filters: 'name LIKE %A'
    }
    Custom options: {
        original: '?sort=-name&fields=name,age&name=*A',
        pagination: 'LIMIT 10 OFFSET 0',
        fields: 'name,age',
        sort: 'name DESC',
        filters: 'name LIKE %A'
    }
*/

```

## `buildSql()`

The library has a function that transforms the query object into a query string that is understandable by MySQL. For 
that, you can inform the name of the table where you want to apply the query, and the query string in MySQL format will
be built based on the object of consultation.

Example: 

```js
const qs = require('mysql-qs-parser');

console.log('Default options:', qs.buildSql('users', qs.parser('?sort=-name&fields=name,age&name=*A')))
console.log('Custom options:', qs.buildSql('users', qs.parser('?sort=-name&fields=name,age&name=*A', { pagination: 'LIMIT 10 OFFSET 0'})))

/*
    Default options: SELECT name,age FROM users WHERE name LIKE %A LIMIT 100 OFFSET 0 ORDER BY name DESC;
    Custom options: SELECT name,age FROM users WHERE name LIKE %A LIMIT 10 OFFSET 0 ORDER BY name DESC;
*/
```
