import plugin_gridsome_plugin_google_analytics_5 from "C:\\git\\covid-19-florida-historic-data\\node_modules\\@gridsome\\plugin-google-analytics\\gridsome.client.js"
import plugin_gridsome_plugin_sentry_7 from "C:\\git\\covid-19-florida-historic-data\\node_modules\\gridsome-plugin-sentry\\gridsome.client.js"

export default [
  {
    run: plugin_gridsome_plugin_google_analytics_5,
    options: {"id":"UA-161455753-1"}
  },
  {
    run: plugin_gridsome_plugin_sentry_7,
    options: {"dsn":"https://907a3bc47ea24ac3ac5fe0514faaf1d8@sentry.io/5169582","attachProps":true}
  }
]
