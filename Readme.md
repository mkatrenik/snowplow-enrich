
# snowplow-enrich

[Snowplow](https://github.com/snowplow/snowplow) compatible enrich plugin for nodejs

## why snowplow?
maybe you want some additional metrics to GA or custom metrics or realtime metrics ...

## why not to use original snowplow enrichment process?
maybe you don't want to mess with hadoop, or you have just small amount of data or you are interested only in some subset of events and don't want log everything etc.
I'm using it with custom express based collector which produces nice json logs, something like this

``` js
app.get('/i', function(req, res) {
  var log = {}
  var uri = url.parse(req.url)
  log.timestamp = new Date().getTime()
  log.payload = uri.query
  log.ipAddress = req.ip
  log.encoding = 'utf8'
  log.headers = req.headers
  log.refererUri = req.headers['referer'] || req.headers['referrer']
  log.userAgent = req.headers['user-agent']
  // log request
  fs.appendFileSync(conf['collector log file'], JSON.stringify(log) + "\n")
  return res.type('gif').sendfile('./public/images/i')
});
```