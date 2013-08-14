
var d = require('debug')('snowplow-enrich:enrichments')

module.exports = {
  user: function (payload, e) {
    e.domain_userid = payload.duid
    e.domain_sessionidx = parseInt(payload.vid)
    e.network_userid = payload.nuid
    e.user_id = payload.uid
  },

  application: function (payload, e) {
    e.app_id = payload.aid
    e.platform = payload.p
  },

  deviceDateTime: function (payload, e) {
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
  },

  eventType: function (payload, e) {
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
  },

  snowplowTracker: function (payload, e) {
    e.v_tracker = payload.tv
  },

  device: function (payload, e) {
    // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#16-device-related-properties
  },

  webSpecific: function (payload, e) {
    // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#21-web-specific-parameters
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
  },

  internetSpecific: function (payload, e) {
    // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#22-internet-of-things-specific-parameters
    e.mac_address = payload.mac
  },

  pagePings: function (payload, e) {
    // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#32-page-pings
  },

  linkClick: function (payload, e) {
    // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#33-link-click-tracking
  },

  adImpression: function (payload, e) {
    // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#34-ad-impression-tracking
  },

  eCommerce: function (payload, e) {
    // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#35-ecommerce-tracking
  },

  social: function (payload, e) {
    // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#36-social-tracking
  },

  error: function (payload, e) {
    // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#38-error-tracking
  },

  structEvent: function (payload, e) {
    // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#39-custom-structured-event-tracking
    e.se_category = payload.se_ca || payload.ev_ca
    e.se_action = payload.se_ac || payload.ev_ac
    e.se_label = payload.se_la || payload.ev_la
    e.se_property = payload.se_pr || payload.ev_pr
    e.se_value = parseFloat(payload.se_va) || parseFloat(payload.ev_ca)
  },

  unstructuredEvent: function (payload, e) {
    // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#310-custom-unstructured-event-tracking
    e.ue_name = payload.ue_na
    e.ue_json = payload.ue_pr
    if(payload.ue_px)
      e.ue_json = new Buffer(payload.ue_px, 'base64').toString('utf8') // decade base64
  }
}