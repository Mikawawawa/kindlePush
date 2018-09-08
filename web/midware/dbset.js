const mysql = require('mysql');

class Dbset {
    constructor(config) {
        if (config) {
            this._connection = mysql.createConnection(config)
            console.log(`DATA:link to ${config.database}`)
        } else {
            throw new Error("There is a trouble occured as there aren't enough params")
        }
    }

    connect() {
        this._connection.connect()
    }

    disconnect() {
        this._connection.end()
    }

    list(callback = (data) => {
        console.log(data)
    }) {
        this._connection.query({
            sql: "SHOW TABLES"
        }, (err, data, field) => {
            if (!err)
                callback(this._sortOut(data))
            else
                throw err
        })
    }
    insert(config, callback = (data) => {
        console.log(data)
    }) {
        let table = config.table,
            _value = config.value
        let value = this._setValue(_value)
        let sql = [`INSERT INTO \`${table}\``, `${value}`].join(" ")

        this._connection.query({
            sql: sql
        }, (err, data, field) => {
            if (!err)
                callback(this._sortOut(data))
            else
                throw err
        })
    }

    delete(config, callback = (data) => {
        console.log(data)
    }, confirm = (data) => {
        console.log(data)
    }) {
        let table = config.table,
            _condition = config.condition ? config.condition : ''

        let condition = _condition !== '' ? this._setCondition(_condition) : ""

        let sql = [`DELETE FROM ${table}`, `${condition}`].join(" ")

        let process = new Promise((resolve, reject) => {
            this.select(config, (data) => {
                resolve(data)
            })
        }).then((last) => {
            confirm(last)
            this._connection.query({
                sql: sql
            }, (err, data) => {
                if (!err)
                    callback(this._sortOut(data))
                else
                    throw err
            })
        })
    }

    update(config, callback = (data) => {
        console.log(data)
    }) {
        let table = config.table,
            _condition = config.condition ? config.condition : '',
            _value = config.value ? config.value : ''

        let condition = _condition !== '' ? this._setCondition(_condition) : ""
        let value = _value ? config.value : ''

        let sql = [`UPDATE \`${table}\``, value, condition].join(" ")

        this._connection.query({
            sql: sql
        }, (err, data, field) => {
            if (!error)
                callback(this._sortOut(data))
            else
                throw error
        })
    }

    select(config, callback) {
        let table = config.table,
            _condition = config.condition ? config.condition : '',
            _order = config.order ? config.order : ''

        let condition = _condition !== '' ? this._setCondition(_condition) : ''

        let order = _order !== '' ? this._setOrder(table, _order) : ''

        let sql = [`SELECT * FROM \`${table}\``, `${condition}`, `${order}`].join(" ")

        this._connection.query({
            sql: sql
        }, (error, data, field) => {
            if (!error)
                callback(this._sortOut(data))
            else
                throw error
        })
    }

    call(config,callback){
        let {action,param}=config
    }

    _sortOut(data) {
        return JSON.parse(JSON.stringify(data))
    }

    _getType(param) {
        if (typeof (param) == "string" || typeof (param) == "number") {
            return typeof (param)
        } else {
            return param.constructor.name
        }
    }

    _setPair(pair) {
        let str = []
        for (let key in pair) {
            str.push(`${key}=${pair[key]}`)
        }
        return `SET ${str.join(", ")}`
    }

    _setValue(value) {
        let str = [
            "", "VALUES", ""
        ]
        let _key = [],
            _value = []
        for (let key in value) {
            _key.push(`\`${key}\``)
            _value.push(`'${value[key]}'`)
        }
        str[0] = `(${_key.join(", ")})`
        str[2] = `(${_value.join(", ")})`
        return str.join(" ")
    }

    _setCondition(condition) {
        var str = ["WHERE"]
        for (let key in condition) {
            if (typeof (condition[key] == "string")) {
                str.push(`\`${key}\` LIKE '${condition[key]}'`)
            } else if (typeof (condition[key] == "number")) {
                str.push(`\`${key}\` = ${condition[key]}`)
            }
        }
        return str.join(" ")
    }

    _setOrder(table, order) {
        return ["ORDER BY", `\`${table}\`.\`${order.key}\``, `${order.type}`].join(" ")
    }
}

module.exports = Dbset