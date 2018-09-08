class Util {
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

module.exports = Util