module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    reporters: ['spec'],
    browsers: ['PhantomJS'],
    files: [
      'lib/aegon-frontend-library/aegon-scripts-library/vendor/drupal_misc/jquery.js',
      'lib/aegon-frontend-library/aegon-scripts-library/vendor/drupal_misc/drupal.js',
      'lib/aegon-frontend-library/aegon-scripts-library/vendor/wNumb.js',
      'lib/aegon-frontend-library/aegon-scripts-library/vendor/drupal_misc/**/*.js',
      'lib/aegon-frontend-library/aegon-scripts-library/components/quickquote-lijfrente.js',
      'lib/aegon-frontend-library/aegon-scripts-library/components/quickquote-lijfrente-sparen.js',
      'lib/aegon-frontend-library/aegon-scripts-library/node_modules/es6-shim/es6-shim.min.js',
      'dist/scripts/angular2core.js',
      'lib/aegon-frontend-library/aegon-scripts-library/node_modules/angular2/bundles/testing.dev.js',
      'dist/scripts/aegon-angular2.js',
      'lib/aegon-frontend-library/aegon-scripts-library/test/system.config.js',
      {
        pattern: '**/test/**/*.spec.js', included: false, watched: true
      }
    ]
  });
};
