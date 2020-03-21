// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const SentryPlugin = require('@sentry/webpack-plugin');

module.exports = {
  siteName: "Florida Virus Tracker",
  siteUrl: 'https://www.flacoronavirustracker.com',
  icon: {
    favicon: {
      src: './src/favicon.png',
      sizes: [16, 32, 96]
    },
    touchicon: {
      src: './src/favicon.png',
      sizes: [76, 152, 120, 167],
      precomposed: true
    }
  },
  transformers: {
    remark: {
      externalLinksTarget: "_blank",
      externalLinksRel: ["nofollow", "noopener", "noreferrer"],
      anchorClassName: "fas fa-link",
      plugins: [
        // ...global plugins
      ],
    },
  },
  configureWebpack: {
    devtool: "hidden-source-map",
    plugins: [
      // new SentryPlugin({
      //   release: process.env.VUE_APP_SENTRY_RELEASE,
      //   include: './dist',
      //   ignore: ['node_modules', 'webpack.config.js'],
      // }),
    ]
  },
  // chainWebpack (config) {
  //   config.mode('development')
  //   // config.devtool('source-map')

  // },
  plugins: [
    {
      use: '@gridsome/plugin-google-analytics',
      options: {
        id: 'UA-161455753-1'
      }
    },
    {
      use: '@gridsome/plugin-sitemap',
      options: {
        cacheTime: 600000, // default
        // exclude: ['/exclude-me'],
        // config: {
        //   '/articles/*': {
        //     changefreq: 'weekly',
        //     priority: 0.5
        //   },
        //   '/about': {
        //     changefreq: 'monthly',
        //     priority: 0.7
        //   }
        // }
      }
    },
  //   {
  //   use: 'gridsome-plugin-purgecss',
  //   // default options, the following will be included if you don't provide anything
  //   options: {
  //     content: [
  //       './src/**/*.vue',
  //       './src/**/*.js',
  //       './src/**/*.jsx',
  //       './src/**/*.pug',
  //       './src/**/*.md'
  //     ],
  //     defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || [],
  //   }
  // },
  {
      use: 'gridsome-plugin-sentry',
    options: {
        dsn: 'https://907a3bc47ea24ac3ac5fe0514faaf1d8@sentry.io/5169582',
        attachProps: true // defaults to true
      }
    }
    // {
    //   use: '~/source-xls-enroll',
    //   options: {}
    // }
    // {
    //   use: "@gridsome/source-filesystem",
    //   options: {
    //     path: "posts/**/*.md",
    //     typeName: "Post",
    //     remark: {
    //       plugins: [
    //         // ...local plugins
    //       ],
    //     },
    //   },
    // },
    // {
    //   use: `gridsome-plugin-netlify-cms`,
    //   options: {
    //     publicPath: `/admin`,
    //   },
    // },
    // {
    //   use: "@gridsome/source-filesystem",
    //   options: {
    //     path: 'data/SchoolGrades19.csv',
    //     typeName: 'Grades',
    //   },
    // },
    // {
    //   use: "gridsome-source-google-sheets",
    //   options: {
    //     sheetId: "1Wa2SJBbXKYUgePk-zllI4Ht58mjPhqXAhF0dnITGHkM",
    //     apiKey: "AIzaSyAaKYsGzMRjFMGiPM3TeVXg0b_dDOS9evk",
    //     // route: "sheets/:title", //Optional - omit if not using routes
    //     type: 'Grades', //Optional - default is googleSheet. Used for graphql queries.
    //   },
    // },
    // {
    //   use: "@gridsome/source-filesystem",
    //   options: {
    //     path: 'data/rc_base.csv',
    //     typeName: 'Schools',
    //   },
    // },
    // {
    //   use: "gridsome-source-google-sheets",
    //   options: {
    //     sheetId: "1uC2_iFd16reAGgv27oElz-f6fluAgdIagL5jcfGwNSQ",
    //     apiKey: "AIzaSyAaKYsGzMRjFMGiPM3TeVXg0b_dDOS9evk",
    //     // route: "sheets/:title", //Optional - omit if not using routes
    //     type: 'Schools', //Optional - default is googleSheet. Used for graphql queries.
    //   },
    // },
    // {
    //   use: "@gridsome/source-filesystem",
    //   options: {
    //     path: 'data/district_list.csv',
    //     typeName: 'Districts',
    //   },
    // },
  ],
};