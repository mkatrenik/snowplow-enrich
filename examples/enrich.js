
var Enricher = require('..')
  , CanonicalInput = require('..').CanonicalInput
  , fs = require('fs')
  , es = require('event-stream')
  , util = require('util')
  ;

// example pipeline with streams - we read stdin in json format (could be any format
// from any source, but you must parse it by yourself), then enriching it and piping
// to stdout
// `cat test/fixtures/log.json | node examples/enrich.js`
es.pipeline(
  process.openStdin(), // or fs.createReadStream(...),
  es.split(),
  es.parse(), // JSON.parse
  es.map(function (data, callback) {
    var enricher = new Enricher(new CanonicalInput(data))
    var e = enricher.enrich()

    var out = util.format("%s (%s)", e.page_url, e.event)
    callback(null, out)
  }),
  process.stdout
)
