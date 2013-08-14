
var assert = require('assert')
  , enrich = require('..')
  , CanonicalInput = require('..').CanonicalInput
  , fs = require('fs')
  ;

var fixtures = JSON.parse(fs.readFileSync(__dirname+'/fixtures/log.json'))
var canonicalInput = new CanonicalInput(fixtures)
// var ci = new CanonicalInput({
//   timestamp: 12345678,
//   payload: 'e=pv&page=Exmaple.com%20title&dtm=1376375078744&tid=37202…&f_gears=0&f_ag=1&res=1280x800&cd=24&cookie=1&url=http%3A%2F%2Fexample.com%2F',
//   ipAddress: '192.168.1.1',
//   userAgent: 'ua',
//   refererUri: '/refererUri'
// })

describe('when enriching CanonicalInput', function(){
  describe('and when using all enrichments', function(){
    it('should work', function(){
      var e = enrich(canonicalInput)
      assert(e.event == 'page_view')
      assert(e.app_id == 'example.com')
    })
  })
})