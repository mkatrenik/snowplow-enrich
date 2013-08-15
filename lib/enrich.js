
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
  var allEnrichments = enrichments()

  for(var enricher in allEnrichments) {
    allEnrichments[enricher](input, e)
  }
  return e
};