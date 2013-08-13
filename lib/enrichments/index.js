
var d = require('debug')('snowplow-enrich:enrichments')

module.exports = {
  user: function (payload) {
    var e = {}
    e.domain_userid = payload.duid
    e.domain_sessionidx = parseInt(payload.vid)
    e.network_userid = payload.nuid
    e.user_id = payload.uid
    return e
  },

  application: function (payload) {
    var e = {}
    e.app_id = payload.aid
    e.platform = payload.p
    return e
  },

  deviceDateTime: function (payload) {
    var e = {}
    try{
      var dtm = parseInt(payload.dtm)
      var dt = (new Date(dtm)).toISOString().split('T')

      e.dvce_dt = dt[0]
      e.dvce_tm = dt[1]
      e.dvce_epoch = dtm
      e.timezone = payload.tz
    } catch (e) {
      d(e.stack)
    }
    return e
  },

  eventType: function (payload) {
    var e = {}
    var eToUpper = (new String(payload.e)).toUpperCase()

    switch (eToUpper) {
      case "EV": // TODO: remove this in the future.
        e.event = "struct";
        break;
      case "SE":
        e.event = "struct";
        break;
      case "AD":
        e.event = "ad_impression";
        break;
      case "TR":
        e.event = "transaction";
        break;
      case "TI":
        e.event = "transaction_item";
        break;
      case "PV":
        e.event = "page_view";
        break;
      case "PP":
        e.event = "page_ping";
        break;
      case "UE": // ????
        e.event = "unstruct";
        break;
      default: // Should never happen
        e.event = "";
        break;
    }

    e.tid = payload.txn_id
    return e
  },

  snowplowTracker: function (payload) {
    var e = {}
    e.v_tracker = payload.tv
    return e
  },

  device: function (payload) {
    // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#16-device-related-properties
    var e = {}
    return e
  },

  webSpecific: function (payload) {
    // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#21-web-specific-parameters
    var e = {}
    e.page_url = payload.url
    e.page_title = payload.page
    e.page_referrer = payload.refr
    e.user_fingerprint = parseInt(payload.fp)
    e.connection_type = payload.ctype
    e.br_cookies = parseInt(payload.cookie)
    e.br_lang = payload.lang
    // features

    e.br_features = []

    var featuresMap = {
      "f_pdf":"br_features_pdf"
      ,"f_qt":"br_features_quicktime"
      ,"f_realp":"br_features_realplayer"
      ,"f_wma":"br_features_windowsmedia"
      ,"f_dir":"br_features_director"
      ,"f_fla":"br_features_flash"
      ,"f_java":"br_features_java"
      ,"f_gears":"br_features_gears"
      ,"f_ag":"br_features_silverlight"
    }
    for(var f in featuresMap) {
      var fkey = f.slice(2) // pdf
      var fval = parseInt( payload[f] ) // 1|0
      e["br_features_" + fkey] = fval // e.br_features_pdf = 1|0
      if( fval ) e.br_features.push( fkey ) // e.br_features = [pdf]
    }

    e.br_colordepth = payload.cd
    e.doc_width = payload.ds
    e.doc_charset = payload.cs
    try{
      var wh = payload.vp.split("x")
      e.br_viewwidth = wh[0]
      e.br_viewheight = wh[1]
    } catch (e) {
      d(e.stack)
    }
    return e
  },

  internetSpecific: function (payload) {
    // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#22-internet-of-things-specific-parameters
    var e = {}
    e.mac_address = payload.mac
    return e
  },

  pagePings: function (payload) {
    // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#32-page-pings
    return {}
  },

  linkClick: function (payload) {
    // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#33-link-click-tracking
    return {}
  },

  adImpression: function (payload) {
    // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#34-ad-impression-tracking
    return {}
  },

  eCommerce: function (payload) {
    // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#35-ecommerce-tracking
    return {}
  },

  social: function (payload) {
    // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#36-social-tracking
    return {}
  },

  error: function (payload) {
    // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#38-error-tracking
    return {}
  },

  structEvent: function (payload) {
    // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#39-custom-structured-event-tracking
    var e = {}

    e.se_category = payload.se_ca || payload.ev_ca
    e.se_action = payload.se_ac || payload.ev_ac
    e.se_label = payload.se_la || payload.ev_la
    e.se_property = payload.se_pr || payload.ev_pr
    e.se_value = parseFloat(payload.se_va) || parseFloat(payload.ev_ca)

    return e
  },

  unstructuredEvent: function (payload) {
    // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#310-custom-unstructured-event-tracking
    var e = {}

    e.ue_name = payload.ue_na
    e.ue_json = payload.ue_pr
    if(payload.ue_px)
      e.ue_json = new Buffer(payload.ue_px, 'base64').toString('utf8') // decade base64

    return e
  }
}