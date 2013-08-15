
var payload = require('./payload')
  , raw = require('./raw')
  , _ = require('lodash')
  ;

exports = module.exports = function () {
  var all = _.extend({}, payload)
  all = _.extend(all, raw)
  return all
}

exports._payload = payload
exports._raw = raw