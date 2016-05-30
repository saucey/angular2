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
      'dist/scripts/angular2core.js',
      'dist/scripts/aegon-angular2.js',
      'dist/scripts/test/aegon-tests.js'
      //'lib/aegon-frontend-library/aegon-scripts-library/**/test/**/*.js'
      //'!lib/aegon-frontend-library/aegon-scripts-library/node_modules'
    ]
  });
};
