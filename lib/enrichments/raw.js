
var d = require('debug')('snowplow-enrich:enrichments:raw')
  , uuid = require('uuid')
  , fs = require('fs')
  , uaParser = require('ua-parser')
  ;


try{
  var pkg = {}
  pkg = JSON.parse(fs.readFileSync(__dirname + '/../../package.json'))
} catch (e) {
  console.error('couldn\'t load package.json')
}

module.exports = {
  basic: function (raw, e) {
    e.collector_tstamp = raw.timestamp
    e.event_id = uuid.v4() //UUID.randomUUID().toString
    e.event_vendor = "com.snowplowanalytics" // we try to be compatible as much we can ... so i think we could leave it as it is
    e.v_collector = raw.source.collector // May be updated later if we have a `cv` parameter
    e.v_etl = etlVersion()
    e.user_ipaddress = raw.ipAddress
  },

  userAgent: function (raw, e) {
    // TODO check other parsers - woothee, useragent
    var c = uaParser.parse(raw.userAgent)

    e.br_name = c.ua.toString()
    e.br_family = c.ua.family
    e.br_version = c.ua.major + '.' + c.ua.minor
    e.br_type = ''
    e.br_renderengine = ''
    e.os_name = ''
    e.os_family = c.os.family
    e.os_manufacturer = ''
    e.dvce_type = c.device.family
    e.dvce_ismobile = ''
  }
}

function etlVersion() {
  return 'snowplow-enrich-' + (pkg.version || '')
}
