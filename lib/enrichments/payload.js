
var d = require('debug')('snowplow-enrich:enrichments:payload')

module.exports = {
  user: function (raw, e) {
    e.domain_userid = raw.payload.duid
    e.domain_sessionidx = parseInt(raw.payload.vid)
    e.network_userid = raw.payload.nuid
    e.user_id = raw.payload.uid
  },

  application: function (raw, e) {
    e.app_id = raw.payload.aid
    e.platform = raw.payload.p
  },

  deviceDateTime: function (raw, e) {
    try{
      var dtm = parseInt(raw.payload.dtm)
      var dt = (new Date(dtm)).toISOString().split('T')

      e.dvce_dt = dt[0]
      e.dvce_tm = dt[1]
      e.dvce_epoch = dtm
      e.timezone = raw.payload.tz
    } catch (e) {
      d(e.stack)
    }
  },

  eventType: function (raw, e) {
    var eToUpper = (new String(raw.payload.e)).toUpperCase()

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

    e.tid = raw.payload.txn_id
  },

  snowplowTracker: function (raw, e) {
    e.v_tracker = raw.payload.tv
  },

  device: function (raw, e) {
    // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#16-device-related-properties
  },

  webSpecific: function (raw, e) {
    // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#21-web-specific-parameters
    e.page_url = raw.payload.url
    e.page_title = raw.payload.page
    e.page_referrer = raw.payload.refr
    e.user_fingerprint = parseInt(raw.payload.fp)
    e.connection_type = raw.payload.ctype
    e.br_cookies = parseInt(raw.payload.cookie)
    e.br_lang = raw.payload.lang
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
      var fval = parseInt( raw.payload[f] ) // 1|0
      e["br_features_" + fkey] = fval // e.br_features_pdf = 1|0
      if( fval ) e.br_features.push( fkey ) // e.br_features = [pdf]
    }

    e.br_colordepth = raw.payload.cd
    e.doc_width = raw.payload.ds
    e.doc_charset = raw.payload.cs
    try{
      var wh = raw.payload.vp.split("x")
      e.br_viewwidth = wh[0]
      e.br_viewheight = wh[1]
    } catch (e) {
      d(e.stack)
    }
  },

  internetSpecific: function (raw, e) {
    // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#22-internet-of-things-specific-parameters
    e.mac_address = raw.payload.mac
  },

  pagePings: function (raw, e) {
    // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#32-page-pings
  },

  linkClick: function (raw, e) {
    // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#33-link-click-tracking
  },

  adImpression: function (raw, e) {
    // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#34-ad-impression-tracking
  },

  eCommerce: function (raw, e) {
    // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#35-ecommerce-tracking
  },

  social: function (raw, e) {
    // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#36-social-tracking
  },

  error: function (raw, e) {
    // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#38-error-tracking
  },

  structEvent: function (raw, e) {
    // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#39-custom-structured-event-tracking
    e.se_category = raw.payload.se_ca || raw.payload.ev_ca
    e.se_action = raw.payload.se_ac || raw.payload.ev_ac
    e.se_label = raw.payload.se_la || raw.payload.ev_la
    e.se_property = raw.payload.se_pr || raw.payload.ev_pr
    e.se_value = parseFloat(raw.payload.se_va) || parseFloat(raw.payload.ev_ca)
  },

  unstructuredEvent: function (raw, e) {
    // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#310-custom-unstructured-event-tracking
    e.ue_name = raw.payload.ue_na
    e.ue_json = raw.payload.ue_pr
    if(raw.payload.ue_px)
      e.ue_json = new Buffer(raw.payload.ue_px, 'base64').toString('utf8') // decade base64
  }
}