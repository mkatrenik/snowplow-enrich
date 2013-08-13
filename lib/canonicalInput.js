
var d = require('debug')('snowplow-enrich:input')
  , querystring = require('querystring')
  , range_check = require('range_check')
  , _ = require('lodash')
  ;

/**
 * canonical input format
 * @param {Object} opts [timestamp, payload, encoding, ipAddress, userAgent
 *                      , refererUri, headers, userId]
 */

exports = module.exports = function CanonicalInput (opts) {
  d("constructing input from %s", JSON.stringify(opts))

  if(_.isNumber(opts.timestamp)) this.timestamp = Number(opts.timestamp)
  else throw new Error('timestamp should be Integer')


  if(opts.payload && _.isObject(opts.payload)) this.payload = opts.payload
  else if(opts.payload && _.isString(opts.payload)) {
    // default should be GET payload as query string
    // TODO should have some def attrs maybe?
    this.payload = querystring.parse(opts.payload)
  } else {
    throw new Error("Payload should be either `Object` or GET query as `String`")
  }

  this.source = {} // NYI
  this.encoding = opts.encoding || 'utf8'

  if(opts.ipAddress && range_check.valid_ip(opts.ipAddress)) this.ipAddress = opts.ipAddress
  else throw new Error('Invalid IP address [ '+opts.ipAddress+' ]')

  if(opts.userAgent && !_.isEmpty(opts.userAgent)) this.userAgent = opts.userAgent
  else throw new Error('userAgent should be set as `String`')

  if(opts.refererUri && !_.isEmpty(opts.refererUri)) this.refererUri = opts.refererUri
  else throw new Error('referer uri shoul be set as `String`')

  if(Array.isArray(opts.headers)) this.headers = opts.headers
  else this.headers = []

  this.userId = opts.userId || null
}
