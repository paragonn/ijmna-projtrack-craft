const mix = require("laravel-mix");

require("laravel-mix-tailwind");
require("laravel-mix-copy-watched");

// require('laravel-mix-purgecss');
// const purgeExclude = require('./purge.mix.js');

// const purgeContent = [
//   "templates/**/*.php",
//   "templates/**/*.twig",
//   "templates/**/*.html",
//   "templates/**/*.json",
//   "templates/**/*.js",
//   "templates/**/*.rss",
//   "src/js/**/*.js",
//   "web/assets/icons/**/*.svg",
// ];

/*
|--------------------------------------------------------------------------
| Mix Asset Management
|--------------------------------------------------------------------------
|
| Mix provides a clean, fluent API for defining some Webpack build steps
| for your Laravel applications. By default, we are compiling the CSS
| file for the application as well as bundling up all the JS files.
|
*/

mix.version();
mix.sourceMaps();
mix.disableSuccessNotifications();

mix.options({
    autoprefixer: {
        remove: false,
    },
});

/*mix.autoload( {
	jquery: [ '$', 'window.$', 'window.jQuery' ]
} );*/

mix.setPublicPath("web/assets");

// setPublicPath() only controls where Mix writes files on disk / how the
// mix() Twig helper builds versioned URLs. It does NOT set webpack's own
// runtime publicPath, which is what dynamically-imported chunks (e.g. the
// import("@turf/buffer") in projects-search.js) use to build their request
// URL at runtime -- that defaulted to "/", not "/assets/", so a lazy chunk
// would 404 in production. This aligns the two.
mix.webpackConfig({
    output: {
        publicPath: "/assets/",
    },
});

mix.js("src/js/app.js", "js");
mix.js("src/js/glightbox.js", "js");
mix.js("src/js/swiper.js", "js");
mix.js("src/js/projects-search.js", "js");

/*mix.sass( 'src/scss/all.scss', 'css' ).purgeCss({
  enabled: (process.env.PURGE_CSS == "true" ? true : false),
  content: purgeContent,
  safelist: { standard: purgeExclude.whitelist }
});*/

mix.sass("src/scss/app.scss", "css");
mix.sass("src/scss/glightbox.scss", "css");
mix.sass("src/scss/swiper.scss", "css");

mix.browserSync({
    proxy: process.env.PRIMARY_SITE_URL,
    files: ["templates/**/*", "web/assets/**/*"],
    browser: process.env.LOCAL_BROWSER,
    injectChanges: true,
});

mix.tailwind();
