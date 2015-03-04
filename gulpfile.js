'use strict';

/**
 * Modules
 */

var
  autoprefixer = require('gulp-autoprefixer'),
  browserSync = require('browser-sync'),
  collate = require('./tasks/collate'),
  compile = require('./tasks/compile'),
  concat = require('gulp-concat'),
  del = require('del'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  gulpif = require('gulp-if'),
  header = require('gulp-header'),
  imagemin = require('gulp-imagemin'),
  order = require('gulp-order'),
  plumber = require('gulp-plumber'),
  Q = require('q'),
  rename = require('gulp-rename'),
  reload = browserSync.reload,
  runSequence = require('run-sequence'),
  sass = require('gulp-sass'),
  streamify = require('gulp-streamify'),
  uglify = require('gulp-uglify');


/**
 * Configuration
 */

var config = {
  dev: gutil.env.dev,
  src: {
    libAssetsPath: './lib/aegon-assets-library',
    libSassPath: './lib/aegon-sass-library',
    libScriptsPath: './lib/aegon-scripts-library',
    libBowerPath: './lib/bower_components',
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
    .pipe(gulp.dest(config.dest + '/fabricator'));
});


/**
 * Library tasks
 */

gulp.task('styles:library', function () {
  return gulp.src(config.src.libSassPath + '/*.scss')
    .pipe(plumber())
    .pipe(sass({
      errLogToConsole: true,
      includePaths: config.src.libBowerPath,
      outputStyle: gulpif(!config.dev, 'compressed')
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 version', 'ie 9'],
      cascade: false
    }))
    .pipe(gulp.dest(config.dest + '/styles'))
    .pipe(gulpif(config.dev, reload({stream:true})));
});

gulp.task('scripts:library', function () {
  
  // Internet Explorer stuff
  gulp.src([
      config.src.libScriptsPath + '/vendor/ie/**/*.js'
    ])
    .pipe(plumber())
    .pipe(concat('ie-aegon-library.js'))
    .pipe(gulpif(!config.dev, streamify(uglify())))
    .pipe(gulpif(!config.dev, header(banner, { pkg : pkg } )))
    .pipe(gulp.dest(config.dest + '/scripts'));

  // Main scripts
  return gulp.src([
      config.src.libScriptsPath + '/**/*.js',
      '!' + config.src.libScriptsPath + '/vendor/ie/**/*.js'
    ])
    .pipe(plumber())
    .pipe(order([
      'vendor/drupal_misc/jquery.js',
      'vendor/drupal_misc/jquery.once.js',
      'vendor/drupal_misc/drupal.js',
      'vendor/drupal_misc/**/*.js',
      'vendor/drupal_modules/**/*.js',
      'vendor/drupal_themes/**/*.js'
    ], { base: config.src.libScriptsPath }))
    .pipe(concat('aegon-library.js'))
    .pipe(gulpif(!config.dev, streamify(uglify())))
    .pipe(gulpif(!config.dev, header(banner, { pkg : pkg } )))
    .pipe(gulp.dest(config.dest + '/scripts'));
});

gulp.task('assets:library:fonts', function () {

  // Fonts
  return gulp.src(config.src.libAssetsPath + '/fonts/**/*')
    .pipe(gulp.dest(config.dest + '/assets/fonts'));
});

gulp.task('assets:library:images', function () {

  // Images
  return gulp.src(config.src.libAssetsPath + '/images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest(config.dest + '/assets/images'));
});

gulp.task('assets:library', ['assets:library:fonts', 'assets:library:images']);


/**
 * Toolkit tasks
 */

gulp.task('styles:toolkit', function () {
  return gulp.src(config.src.styles.toolkit)
    .pipe(plumber())
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: gulpif(!config.dev, 'compressed')
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 version', 'ie 9'],
      cascade: false
    }))
    .pipe(gulp.dest(config.dest + '/styles'))
    .pipe(gulpif(config.dev, reload({stream:true})));
});

gulp.task('scripts:toolkit', function () {
  return gulp.src(config.src.scripts.toolkit)
    .pipe(plumber())
    .pipe(order([
      'vendor/**/*.js'
    ], { base: config.src.scripts.toolkit }))
    .pipe(concat('toolkit.js'))
    .pipe(gulpif(!config.dev, streamify(uglify())))
    .pipe(gulp.dest(config.dest + '/scripts'));
});

gulp.task('images', ['favicon'], function () {
  return gulp.src(config.src.images)
    .pipe(imagemin())
    .pipe(gulp.dest(config.dest + '/images'));
});

gulp.task('favicon', function () {
  return gulp.src('./src/favicon.ico')
    .pipe(gulp.dest(config.dest));
});


/**
 * Concurrent tasks
 */

gulp.task('assets', ['assets:library']);

gulp.task('styles', ['styles:fabricator', 'styles:library', 'styles:toolkit']);

gulp.task('scripts', ['scripts:fabricator', 'scripts:library', 'scripts:toolkit']);


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
    .pipe(gulp.dest(config.dest));
});

gulp.task('assemble:templates', function () {
  var opts = {
    data: config.dest + '/fabricator/data/data.json',
    template: true
  };
  return gulp.src('./src/templates/*.html')
    .pipe(compile(opts))
    .pipe(rename({
      autoprefixer: 'template-'
    }))
    .pipe(gulp.dest(config.dest));
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
      routes: {
        "/assets": config.src.libAssetsPath
      }
    },
    // Tunnel the BrowserSync server through a random Public URL
    // -> http://randomstring23232.localtunnel.me
    // tunnel: true
    // Attempt to use the URL "http://my-private-site.localtunnel.me"
    // tunnel: "my-private-site"
    notify: false
  });
});

// Watch
gulp.task('watch', ['browser-sync'], function () {
  gulp.watch(
    'src/{components,widgets,structures,templates,documentation,views}' +
    '/**/*.{html,md}',
    ['assemble', browserSync.reload]);

  gulp.watch(
    'lib/fabricator/styles/**/*.scss',
    ['styles:fabricator']);

  gulp.watch(
    config.src.libSassPath + '/**/*.scss',
    ['styles:library']);

  gulp.watch(
    'src/assets/styles/**/*.scss',
    ['styles:toolkit']);

  gulp.watch(
    'lib/fabricator/scripts/**/*.js',
    ['scripts:fabricator', browserSync.reload]);

  gulp.watch(
    config.src.libScriptsPath + '/**/*.js',
    ['scripts:library', browserSync.reload]);

  gulp.watch(
    'src/assets/scripts/**/*.js',
    ['scripts:toolkit', browserSync.reload]);

  gulp.watch(
    config.src.images,
    ['images', browserSync.reload]);

  gulp.watch(
    config.src.libAssetsPath + '/fonts/**',
    ['assets:library:fonts', browserSync.reload]);

  gulp.watch(
    config.src.libAssetsPath + '/images/**',
    ['assets:library:images', browserSync.reload]);
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
