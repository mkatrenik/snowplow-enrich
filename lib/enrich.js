
var _ = require('lodash')
  , enrichments = require('./enrichments')
  , canonicalOutput = require('./canonicalOutput')
  , CanonicalInput =  require('./canonicalInput')
  ;

module.exports = enrich

/**
 * Build event outupt from input
 *
 * @param {Object} input [CanonicalInput]
 * @return {Object} [CanonicalOutput]
 */

function enrich(input){
  if(!(input instanceof CanonicalInput)) {
    input = new CanonicalInput(input)
  }
  var e = canonicalOutput()

  for(var enricher in enrichments) {
    enrichments[enricher](input.payload, e)
  }
  return e
};