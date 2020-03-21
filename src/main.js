// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import DefaultLayout from "~/layouts/Default.vue";
// import { library } from "@fortawesome/fontawesome-svg-core";
// import { faCode, faLink, faCheckSquare, faSquare } from "@fortawesome/free-solid-svg-icons";
const titleCase = require('title-case');

// Globaly add these icons for use
// library.add(faCode, faLink, faCheckSquare, faSquare);

// import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import VueDisqus from "vue-disqus";

import "~/assets/scss/bulma-custom.scss";
import "~/assets/scss/global.scss";

export default function(Vue, { router, head, isClient }) {
  // Set default layout as a global component
  Vue.component("Layout", DefaultLayout);
  // Vue.component("font-awesome-icon", FontAwesomeIcon);
  head.script.push({
    src: "https://polyfill.io/v3/polyfill.min.js",
  });
  Vue.filter('titleCase', function (value) { return titleCase(value) })
  Vue.filter('localNumber', function (value) { return parseInt(value).toLocaleString() })
  Vue.use(VueDisqus);
}