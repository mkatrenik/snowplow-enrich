
var assert = require('assert')
  , CanonicalInput = require('..').CanonicalInput

describe('when creating CanonicalInput', function(){
  it('should throw on missing input params', function(){
    assert.throws(function() {
      new CanonicalInput({})
    }, Error)
  })

  it('should throw on wrong input params', function(){
    assert.throws(function() {
      new CanonicalInput({
        timestamp: 12345678,
        payload: 'e=pv',
        // encoding is optional
        ipAddress: '0.0.0a', // wrong IP
        userAgent: 'ua',
        refererUri: '/refererUri'
      })
    }, /Invalid IP address/)
  })

  it('shouldn\'t throw on optional params ', function(){
    assert(new CanonicalInput({
      timestamp: 12345678,
      payload: 'e=pv',
      // encoding is optional
      ipAddress: '0.0.0.0',
      userAgent: 'ua',
      refererUri: '/refererUri'
    }))
  })
  it('should parse payload when given as query string', function(){
    var input = new CanonicalInput({
      timestamp: 12345678,
      payload: 'e=pv',
      ipAddress: '0.0.0.0',
      userAgent: 'ua',
      refererUri: '/refererUri'
    })
    assert(input.payload.e === 'pv')
  })
})