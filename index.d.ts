declare var queryStringsParserSql: queryStringsParserSql.QueryStringsParserSql
export = queryStringsParserSql

declare namespace queryStringsParserSql {
    export interface QueryStringsParserSql {
        (options?: IOptions): any

        parser(query?: string | object, options?: IOptions): any

        parseFields(query?: string | object, fields_default?: string): any

        parseSort(query?: string | object, sort_default?: string): any

        parsePagination(query?: string | object, pagination_default?: string): any

        parseFilter(query?: string | object, filter_default?: string): any

        buildSql(tableName?: string, options ?: IOptions)
    }


    export interface IOptions {
        fields?: string
        sort?: string
        filters?: string
        pagination?: string
    }
}
