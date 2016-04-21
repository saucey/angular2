'use strict';

/**
 * Modules
 */

var
  autoprefixer = require('gulp-autoprefixer'),
  browserSync = require('browser-sync'),
  collate = require('./lib/fabricator/tasks/collate'),
  compile = require('./lib/fabricator/tasks/compile'),
  compress = require('compression'),
  concat = require('gulp-concat'),
  del = require('del'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  gulpif = require('gulp-if'),
  header = require('gulp-header'),
  imagemin = require('gulp-imagemin'),
  jshint = require('gulp-jshint'),
  karma = require('karma').Server,
  order = require('gulp-order'),
  merge2 = require('merge2'),
  notify = require('gulp-notify'),
  plumber = require('gulp-plumber'),
  Q = require('q'),
  rename = require('gulp-rename'),
  reload = browserSync.reload,
  runSequence = require('run-sequence'),
  sass = require('gulp-sass'),
  streamify = require('gulp-streamify'),
  sftp = require('gulp-sftp'),
  sourcemaps = require('gulp-sourcemaps'),
  ts = require('gulp-typescript'),
  uglify = require('gulp-uglify'),
  watch = require('gulp-watch');


/**
 * Configuration
 */

var config = {
  dev: gutil.env.dev,
  src: {
    libAssetsPath: './lib/aegon-frontend-library/aegon-assets-library',
    libSassPath: './lib/aegon-frontend-library/aegon-sass-library',
    libScriptsPath: './lib/aegon-frontend-library/aegon-scripts-library',
    libStaticStyles: './lib/drupalcore-omega-static-styles',
    scripts: {
      fabricator: [
        './lib/fabricator/scripts/prism.js',
        './lib/fabricator/scripts/fabricator.js'
      ],
      toolkit: './src/assets/scripts/**/*.js'
    },
    styles: {
      fabricator: './lib/fabricator/styles/fabricator.scss',
      toolkit: './src/assets/styles/toolkit.scss'
    },
    data: './src/file/**/*',
    images: 'src/assets/images/**/*',
    views: './src/views/*.html',
    materials: [
      'components',
      'widgets',
      'structures',
      'templates',
      'documentation'
    ]
  },
  dest: './dist'
};

var pkg = require('./package.json');

var banner = ['/**',
  ' * <%= pkg.name %>',
  ' * @description <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @repo <%= pkg.repository.url %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');


/**
 * Fabricator tasks
 */

gulp.task('styles:fabricator', function () {
  return gulp.src(config.src.styles.fabricator)
    .pipe(plumber())
    .pipe(sass({
      errLogToConsole: true,
      includePaths: ['./lib'],
      outputStyle: gulpif(!config.dev, 'compressed')
    }))
    .pipe(autoprefixer('last 1 version'))
    .pipe(rename('f.css'))
    .pipe(gulp.dest(config.dest + '/fabricator'))
    .pipe(gulpif(config.dev, reload({stream:true})));
});

gulp.task('scripts:fabricator', function () {
  return gulp.src(config.src.scripts.fabricator)
    .pipe(plumber())
    .pipe(concat('f.js'))
    .pipe(gulpif(!config.dev, uglify()))
    .pipe(gulp.dest(config.dest + '/fabricator'))
    .pipe(gulpif(config.dev, reload({stream:true})));
});


/**
 * Library tasks
 */

gulp.task('styles:library', function () {

  var onError = function(err) {
    notify.onError({
      title:    "Gulp",
      subtitle: "Failure!",
      message:  "Error: <%= error.message %>",
      sound:    "Beep"
    })(err);

    this.emit('end');
  };


  // TEMP: Start also the styles in toolkit, otherwise EXTRA sub libs
  // dependencies mentioned in main toolkit.scss are skipped from watch task.
  gulp.start('styles:toolkit');

  return gulp.src(config.src.libSassPath + '/*.scss')
    .pipe(plumber({errorHandler: onError}))
    .pipe(gulpif(config.dev, sourcemaps.init()))
    .pipe(sass({
      errLogToConsole: true,
      includePaths: ['./lib'],
      outputStyle: gulpif(!config.dev, 'compressed')
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 version', 'ie 9'],
      cascade: false
    }))
    .pipe(gulpif(config.dev, sourcemaps.write()))
    .pipe(gulp.dest(config.dest + '/styles'))
    .pipe(gulpif(config.dev, reload({stream:true})));
});

gulp.task('scripts:angular2', function () {
  return merge2(
    gulp.src([
      'es6-shim/es6-shim.min.js',
      'systemjs/dist/system-polyfills.js',
      'angular2/es6/dev/src/testing/shims_for_IE.js',
      'angular2/bundles/angular2-polyfills.min.js',
      'systemjs/dist/system.js',
      'rxjs/bundles/Rx.min.js',
      'angular2/bundles/angular2.js',
      'angular2/bundles/http.min.js'
    ], {cwd: config.src.libScriptsPath + '/node_modules'}),

    gulp.src([
      '**/*.ts',
      '!vendor/**/*.ts',
      '!node_modules/**/*.ts',
      '!typings/main.d.ts',
      '!typings/main/**/*.ts'
    ], {cwd: config.src.libScriptsPath, base: config.src.libScriptsPath})
    .pipe(plumber())
    .pipe(ts({
      outFile: 'ts-compiled.js',
      target: 'es5',
      module: 'system',
      moduleResolution: 'node',
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
      removeComments: false,
      noImplicitAny: false
    }))
  )
  .pipe(concat('aegon-angular2.js'))
  .pipe(gulpif(!config.dev, header(banner, { pkg : pkg } )))
  .pipe(gulp.dest(config.dest + '/scripts'))
  .pipe(gulpif(config.dev, reload({stream:true})));
});

gulp.task('scripts:library', ['jshint:library'], function () {

  // Main scripts
  gulp.src([
    '**/*.js',
    '!test/**/*.js',
    '!node_modules/**/',
    '!vendor/ie/**/*.js'
  ], {cwd: config.src.libScriptsPath})
  .pipe(plumber())
  .pipe(order([
    'vendor/drupal_misc/jquery.js',
    'vendor/drupal_misc/jquery.once.js',
    'vendor/drupal_misc/drupal.js',
    'vendor/drupal_misc/**/*.js',
    'vendor/drupal_modules/**/*.js',
    'vendor/**/*.js'
  ], { base: config.src.libScriptsPath }))
  .pipe(concat('aegon-library.js'))
  .pipe(gulpif(!config.dev, streamify(uglify())))
  .pipe(gulpif(!config.dev, header(banner, { pkg : pkg } )))
  .pipe(gulp.dest(config.dest + '/scripts'))
  .pipe(gulpif(config.dev, reload({stream:true})));
});

gulp.task('assets:library:fonts', function () {

  // Fonts
  return gulp.src(config.src.libAssetsPath + '/fonts/**/*')
    .pipe(gulp.dest(config.dest + '/fonts'))
    .pipe(gulpif(config.dev, reload({stream:true})));
});

gulp.task('assets:library:images', function () {

  // Images
  return gulp.src(config.src.libAssetsPath + '/images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest(config.dest + '/images'))
    .pipe(gulpif(config.dev, reload({stream:true})));
});

gulp.task('assets:library', ['assets:library:fonts', 'assets:library:images']);


/**
 * Jshint task
 */

gulp.task('jshint:library', function () {
  return gulp.src([
      config.src.libScriptsPath + '/**/*.js',
      '!' + config.src.libScriptsPath + '/vendor/**/*',
      '!' + config.src.libScriptsPath + '/node_modules/**/*'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(gulpif(!browserSync.active, jshint.reporter('fail')));
});

gulp.task('jshint:toolkit', function () {
  return gulp.src([
      config.src.scripts.toolkit
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(gulpif(!browserSync.active, jshint.reporter('fail')));
});


/**
 * Toolkit tasks
 */

gulp.task('styles:toolkit', function () {

  return gulp.src(config.src.styles.toolkit)
    .pipe(plumber())
    .pipe(gulpif(config.dev, sourcemaps.init()))
    .pipe(sass({
      errLogToConsole: true,
      includePaths: ['./lib'],
      outputStyle: gulpif(!config.dev, 'compressed')
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 version', 'ie 9'],
      cascade: false
    }))
    .pipe(gulpif(config.dev, sourcemaps.write()))
    .pipe(gulp.dest(config.dest + '/styles'))
    .pipe(gulpif(config.dev, reload({stream:true})));
});

gulp.task('styles:drupalcore-omega-static-styles', function () {
  return gulp.src(config.src.libStaticStyles + '/**/*.css')
    .pipe(plumber())
    .pipe(concat('drupalcore-omega-static-styles.css'))
    .pipe(gulp.dest(config.dest + '/styles'));
});

gulp.task('scripts:toolkit', ['jshint:toolkit'], function () {
  return gulp.src(config.src.scripts.toolkit)
    .pipe(plumber())
    .pipe(order([
      'vendor/**/*.js'
    ], { base: config.src.scripts.toolkit }))
    .pipe(concat('toolkit.js'))
    .pipe(gulpif(!config.dev, streamify(uglify())))
    .pipe(gulp.dest(config.dest + '/scripts'))
    .pipe(gulpif(config.dev, reload({stream:true})));
});

gulp.task('images', ['favicon'], function () {
  return gulp.src(config.src.images)
    .pipe(imagemin())
    .pipe(gulp.dest(config.dest + '/images'))
    .pipe(gulpif(config.dev, reload({stream:true})));
});

gulp.task('favicon', function () {
  return gulp.src('./src/favicon.ico')
    .pipe(gulp.dest(config.dest));
});

gulp.task('data', function () {
  return gulp.src(config.src.data)
    .pipe(gulp.dest(config.dest + '/file'));
});


/**
 * Concurrent tasks
 */

gulp.task('assets', ['assets:library']);

gulp.task('styles', ['styles:fabricator', 'styles:library', 'styles:toolkit', 'styles:drupalcore-omega-static-styles']);

gulp.task('scripts', ['scripts:fabricator', 'scripts:angular2', 'scripts:library', 'scripts:toolkit', 'data']);


/**
 * Assembly
 */

gulp.task('assemble:fabricator', function () {
  var opts = {
    data: config.dest + '/fabricator/data/data.json',
    template: false
  };

  return gulp.src(config.src.views)
    .pipe(compile(opts))
    .pipe(gulp.dest(config.dest))
    .pipe(gulpif(config.dev, reload({stream:true})));
});

gulp.task('assemble:templates', function () {
  var opts = {
    data: config.dest + '/fabricator/data/data.json',
    template: true
  };
  return gulp.src('./src/templates/*.html')
    .pipe(compile(opts))
    .pipe(rename({
      prefix: 'template-'
    }))
    .pipe(gulp.dest(config.dest))
    .pipe(gulpif(config.dev, reload({stream:true})));
});

gulp.task('assemble', ['collate'], function () {
  gulp.start('assemble:fabricator', 'assemble:templates');
});


/**
 * Server, Watch and other tasks
 */

// Clean
gulp.task('clean', function (cb) {
  del([config.dest], cb);
});

// Collate
gulp.task('collate', function () {

  // 'collate' is a little different -
  // it returns a promise instead of a stream

  var deferred = Q.defer();

  var opts = {
    materials: config.src.materials,
    dest: config.dest + '/fabricator/data/data.json'
  };

  // run the collate task; resolve deferred when complete
  collate(opts, deferred.resolve);

  return deferred.promise;
});

// Server
gulp.task('browser-sync', function () {
  browserSync({
    server: {
      baseDir: config.dest,
      middleware: [compress()],
      routes: {
        "/assets": config.src.libAssetsPath
      }//,
      //tunnel: true,
      //notify: true
    },
    // Tunnel the BrowserSync server through a random Public URL
    // -> http://randomstring23232.localtunnel.me
    // tunnel: true
    // Attempt to use the URL "http://my-private-site.localtunnel.me"
    // tunnel: "my-private-site"
    notify: false
  });
});

gulp.task('tests:run', function (done) {
  return new karma({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

// Watch
gulp.task('watch', ['browser-sync'], function () {

  watch('src/{components,widgets,structures,templates,documentation,views}' +
    '/**/*.{html,md}', function () {
    gulp.start('assemble');
  });

  watch('lib/fabricator/styles/**/*.scss', function () {
    gulp.start('styles:fabricator');
  });

  watch(config.src.libSassPath + '/**/*.scss', function () {
    gulp.start('styles:library');
  });

  watch('src/assets/styles/**/*.scss', function () {
    gulp.start('styles:toolkit');
  });

  watch('lib/fabricator/scripts/**/*.js', function () {
    gulp.start('scripts:fabricator');
  });

  watch(config.src.libScriptsPath + '/**/*.ts', function () {
    gulp.start('scripts:angular2');
  });

  watch(config.src.libScriptsPath + '/**/*.js', function () {
    gulp.start('scripts:library');
  });

  watch('src/assets/scripts/**/*.js', function () {
    gulp.start('scripts:toolkit');
  });

  watch(config.src.data, function () {
    gulp.start('data');
  });

  watch(config.src.images, function () {
    gulp.start('images');
  });

  watch(config.src.libAssetsPath + '/fonts/**', function () {
    gulp.start('assets:library:fonts');
  });

  watch(config.src.libAssetsPath + '/fonts/**', function () {
    gulp.start('assets:library:fonts');
  });
});

// Default build task
gulp.task('default', ['clean'], function () {

  // define build tasks
  var tasks = [
    'styles',
    'scripts',
    'assets',
    'images',
    'assemble'
  ];

  // run build
  runSequence(tasks, function () {
    if (config.dev) {
      gulp.start('watch');
    }
  });
});

/**
 * Deploy task
 */
gulp.task('deploy', function () {

  // Retrieve private data
  var pvt = require('./private.json');

  // Function to transfer single folder
  var filesTransfer = function (path) {

    return gulp.src(path + '/**/*')
      .pipe(sftp({
        host: pvt.deploy.host,
        user: pvt.deploy.user,
        pass: pvt.deploy.pass,
        remotePath: pvt.deploy.path
      }));
  };

  // Array of paths need to be trasferred
  var paths = [
    config.dest
  ];

  // Iterate each paths in filesTransfer()
  paths.forEach(function (path) {

    // Run action file transfer
    filesTransfer(path);
  });
});
