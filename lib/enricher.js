
var _ = require('lodash')
  , enrichments = require('./enrichments')
  , canonicalOutput = require('./canonicalOutput')
  ;

module.exports = Enricher

/**
 * Initialize a new `Enricher`.
 */

function Enricher(input) {
  this.input = input
}

/**
 * Build event outupt from input
 *
 * @return {CanonicalOutput}
 */

Enricher.prototype.enrich = function(){
  var e = canonicalOutput()

  for(var enricher in enrichments) {
    _.extend(e, enrichments[enricher](this.input.payload))
  }
  return e
};