'use strict';

// modules
var browserSync = require('browser-sync');
var collate = require('./tasks/collate');
var compile = require('./tasks/compile');
var concat = require('gulp-concat');
var csso = require('gulp-csso');
var del = require('del');
var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var imagemin = require('gulp-imagemin');
var order = require('gulp-order');
var plumber = require('gulp-plumber');
var prefix = require('gulp-autoprefixer');
var Q = require('q');
var rename = require('gulp-rename');
var reload = browserSync.reload;
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
// var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');


// configuration
var config = {
  dev: gutil.env.dev,
  src: {
    libAssetsPath: './lib/aegon-assets-library',
    libSassPath: './lib/aegon-sass-library',
    libScriptsPath: './lib/aegon-scripts-library',
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


// Clean
gulp.task('clean', function (cb) {
  del([config.dest], cb);
});


/**
 * Fabricator tasks
 */

gulp.task('styles:fabricator', function () {
  return gulp.src(config.src.styles.fabricator)
    .pipe(plumber())
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(prefix('last 1 version'))
    .pipe(gulpif(!config.dev, csso()))
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
      errLogToConsole: true
      // , includePaths: config.src.styles.libAssetsPath
    }))
    .pipe(prefix({
      browsers: ['last 2 version', 'ie 9'],
      cascade: false
    }))
    .pipe(gulpif(!config.dev, csso()))
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
    .pipe(gulp.dest(config.dest + '/scripts'));

  // Main scripts
  return gulp.src([
      config.src.libScriptsPath + '/**/*.js',
      '!' + config.src.libScriptsPath + '/vendor/ie/**/*.js'
    ])
    .pipe(plumber())
    .pipe(order([
      'vendor/from_misc/jquery.js',
      'vendor/from_misc/jquery.once.js',
      'vendor/from_misc/drupal.js',
      'vendor/from_misc/**/*.js',
      'vendor/from_modules/**/*.js',
      'vendor/from_themes/**/*.js'
    ], { base: config.src.libScriptsPath }))
    .pipe(concat('aegon-library.js'))
    .pipe(gulpif(!config.dev, streamify(uglify())))
    .pipe(gulp.dest(config.dest + '/scripts'));
});


/**
 * Toolkit tasks
 */

gulp.task('styles:toolkit', function () {
  return gulp.src(config.src.styles.toolkit)
    .pipe(plumber())
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(prefix({
      browsers: ['last 2 version', 'ie 9'],
      cascade: false
    }))
    .pipe(gulpif(!config.dev, csso()))
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


/**
 * Concurrent tasks
 */

gulp.task('styles', ['styles:fabricator', 'styles:library', 'styles:toolkit']);

gulp.task('scripts', ['scripts:fabricator', 'scripts:library', 'scripts:toolkit']);


/**
 * Images
 */

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
      prefix: 'template-'
    }))
    .pipe(gulp.dest(config.dest));
});

gulp.task('assemble', ['collate'], function () {
  gulp.start('assemble:fabricator', 'assemble:templates');
});


/**
 * Server, Watch and other tasks
 */

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
  gulp.watch('src/{components,widgets,structures,templates,documentation,views}/**/*.{html,md}', ['assemble', browserSync.reload]);
  gulp.watch('lib/fabricator/styles/**/*.scss', ['styles:fabricator']);
  gulp.watch(config.src.libSassPath + '/**/*.scss', ['styles:library']);
  gulp.watch('src/assets/styles/**/*.scss', ['styles:toolkit']);
  gulp.watch('lib/fabricator/scripts/**/*.js', ['scripts:fabricator', browserSync.reload]);
  gulp.watch(config.src.libScriptsPath + '/**/*.js', ['scripts:library', browserSync.reload]);
  gulp.watch('src/assets/scripts/**/*.js', ['scripts:toolkit', browserSync.reload]);
  gulp.watch(config.src.images, ['images', browserSync.reload]);
});

// Default build task
gulp.task('default', ['clean'], function () {

  // define build tasks
  var tasks = [
    'styles',
    'scripts',
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
