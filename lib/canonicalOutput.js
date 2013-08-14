
module.exports = canonicalOutput

function canonicalOutput() {
  return {
    // The application (site, game, app etc) this event belongs to, and the tracker platform
    app_id: '',
    platform: '',

    // Date/time
    collector_tstamp: '',
    dvce_tstamp: '',

    // Transaction (i.e. this logging event)
    event: '',
    event_vendor: '',
    event_id: '',
    txn_id: '',

    // Versioning
    v_tracker: '',
    v_collector: '',
    v_etl: '',

    // User and visit
    user_id: '',
    user_ipaddress: '',
    user_fingerprint: '',
    domain_userid: '',
    domain_sessionidx: 0,
    network_userid: '',

    // Location
    geo_country: '',
    geo_region: '',
    geo_city: '',
    geo_zipcode: '',
    geo_latitude: 0,
    geo_longitude: 0,

    // Page
    page_url: '', // Note: we project this out in Scalding (because we don't have space in Redshift currently)
    page_title: '',
    page_referrer: '', // Note: we project this out in Scalding (because we don't have space in Redshift currently)

    // Page URL components
    page_urlscheme: '',
    page_urlhost: '',
    page_urlport: 0,
    page_urlpath: '',
    page_urlquery: '',
    page_urlfragment: '',

    // Referrer URL components
    refr_urlscheme: '',
    refr_urlhost: '',
    refr_urlport: 0,
    refr_urlpath: '',
    refr_urlquery: '',
    refr_urlfragment: '',

    // Referrer details
    refr_medium: '',
    refr_source: '',
    refr_term: '',

    // Marketing
    mkt_medium: '',
    mkt_source: '',
    mkt_term: '',
    mkt_content: '',
    mkt_campaign: '',

    // Event
    se_category: '',
    se_action: '',
    se_label: '',
    se_property: '',
    se_value: '', // Technically should be a Double but may be rendered incorrectly by Cascading with scientific notification (which Redshift can't process)

    // Ecommerce transaction (from querystring)
    tr_orderid: '',
    tr_affiliation: '',
    tr_total: '',
    tr_tax: '',
    tr_shipping: '',
    tr_city: '',
    tr_state: '',
    tr_country: '',

    // Ecommerce transaction item (from querystring)
    ti_orderid: '',
    ti_sku: '',
    ti_name: '',
    ti_category: '',
    ti_price: '',
    ti_quantity: '',

    // Page Pings
    pp_xoffset_min: 0,
    pp_xoffset_max: 0,
    pp_yoffset_min: 0,
    pp_yoffset_max: 0,

    // User Agent
    useragent: '',

    // Browser (from user-agent)
    br_name: '',
    br_family: '',
    br_version: '',
    br_type: '',
    br_renderengine: '',

    // Browser (from querystring)
    br_lang: '',
    // Individual feature fields for non-Hive targets (e.g. Infobright)
    br_features_pdf: 0,
    br_features_flash: 0,
    br_features_java: 0,
    br_features_director: 0,
    br_features_quicktime: 0,
    br_features_realplayer: 0,
    br_features_windowsmedia: 0,
    br_features_gears: 0,
    br_features_silverlight: 0,
    br_cookies: 0,
    br_colordepth: '',
    br_viewwidth: 0,
    br_viewheight: 0,

    // OS (from user-agent)
    os_name: '',
    os_family: '',
    os_manufacturer: '',
    os_timezone: '',

    // Device/Hardware (from user-agent)
    dvce_type: '',
    dvce_ismobile: 0,

    // Device (from querystring)
    dvce_screenwidth: 0,
    dvce_screenheight: 0,

    // Document
    doc_charset: '',
    doc_width: 0,
    doc_height: 0
  }
}