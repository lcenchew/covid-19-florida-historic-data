var path = require('path')
var PrerenderSpaPlugin = require('prerender-spa-plugin')
module.exports = {
    // ...
    plugins: [
        new PrerenderSpaPlugin(
            // Absolute path to compiled SPA
            path.join(__dirname, '.'),
            // List of routes to prerender
            ['/', ], {
                captureAfterTime: 5000,
            }

        )
    ]
}