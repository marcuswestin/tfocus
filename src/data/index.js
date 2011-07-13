var schema = require('data/schema'),
  finOrmAPI = require('fin/lib/client/orm-api')

finOrmAPI.process(schema)

module.exports = finOrmAPI


