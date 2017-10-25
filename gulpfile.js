'use strict';

var srcInput      = 'src/',
    srcOutput     = 'public/',
    gulp          = require('gulp'),
    sass          = require('gulp-sass'),
    sassLint      = require('gulp-sass-lint'),
    cssmin        = require('gulp-cssmin'),
    autoprefixer  = require('gulp-autoprefixer'),
    sourcemaps    = require('gulp-sourcemaps'),
    imagemin      = require('gulp-imagemin'),
    concat        = require('gulp-concat'),
    babel         = require('gulp-babel'),
    notify        = require("gulp-notify"),
    minifyjs      = require('gulp-js-minify'),
    plumber       = require('gulp-plumber'),
    pug           = require('gulp-pug'),
    runSequence   = require('run-sequence'),
    del           = require('del'),
    browserSync   = require('browser-sync').create();

gulp.task('sass', function () {
  return gulp.src(srcInput + 'sass/**/*.+(sass|scss)')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sassLint({
       configFile: '.sass-lint.yml'
     }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 version', 'safari 5', 'ie 9', 'ff 17', 'opera 12.1', 'ios 6', 'android 4'],
      cascade: false
    }))
    .pipe(cssmin())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(srcOutput + 'css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('images', function () {
  return gulp.src(srcInput + 'img/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(plumber())
    .pipe(imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(srcOutput + 'img'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('fonts', function () {
  return gulp.src(srcInput + 'fonts/**/*')
    .pipe(plumber())
    .pipe(gulp.dest(srcOutput + 'fonts'))
})

gulp.task('scripts', function () {
  return gulp.src([srcInput + 'js/**/*.js'])
    .pipe(plumber())
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(minifyjs())
    .on("error", notify.onError("Error: <%= error.message %>"))
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(srcOutput + 'js'))
    .pipe(browserSync.reload({
      stream: true
    }))
})

gulp.task('pug', function() {
  return gulp.src(srcInput + 'pug/**/*.pug')
    .pipe(plumber())
    .pipe(pug({
      pretty: true
    }))
    .on("error", notify.onError("Error: <%= error.message %>"))
    .pipe(gulp.dest(srcOutput + 'templates'))
    .pipe(browserSync.reload({
      stream: true
    }))
})

gulp.task('clean', function() {
  return del.sync(srcOutput)
})

gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: './public/'
    },
    startPath: '/templates'
  })
})

gulp.task('watch', ['browserSync', 'sass', 'scripts', 'fonts', 'pug', 'images'], () => {
  gulp.watch(srcInput + 'sass/**/*.+(sass|scss)', ['sass']);
  gulp.watch(srcInput + 'img/**/*.+(png|jpg|jpeg|gif|svg)', ['images']);
  gulp.watch(srcInput + 'fonts/**/*', ['fonts']);
  gulp.watch(srcInput + 'js/**/*.js', ['scripts']);
  gulp.watch(srcInput + 'pug/**/*.pug', ['pug']);
});

gulp.task('default', function (callback) {
  runSequence('clean', ['watch',  'browserSync'],
    callback
  )
})

// gulp.task('build', function (callback) {
//    runSequence('clean', ['default', 'images', 'fonts'], 'useref', 'scripts',
//      callback)
// })
