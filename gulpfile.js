'use strict';

var srcInput      = 'src/',
    srcOutput     = 'public/',
    gulp          = require('gulp'),
    sass          = require('gulp-sass'),
    cssmin        = require('gulp-cssmin'),
    sourcemaps    = require('gulp-sourcemaps'),
    browserSync   = require('browser-sync').create(),
    imagemin      = require('gulp-imagemin'),
    cache         = require('gulp-cache'),
    gutil         = require('gulp-util'),
    concat        = require('gulp-concat'),
    del           = require('del'),
    runSequence   = require('run-sequence'),
    babel         = require('gulp-babel'),
    autoprefixer  = require('gulp-autoprefixer');

const babili = require("gulp-babili");

gulp.task('sass', function () {
  return gulp.src(srcInput + 'sass/**/*.+(sass|scss)')
    .pipe(sourcemaps.init())
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
    .pipe(cache.clear())
    .pipe(imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(srcOutput + 'images'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('fonts', function () {
  return gulp.src(srcInput + 'fonts/**/*')
    .pipe(gulp.dest(srcOutput + 'fonts'))
})

gulp.task('scripts', function () {
  return gulp.src([srcInput + 'js/**/*.js'])
    .pipe(concat('main.min.js'))
    .pipe(babel({
            presets: ['env']
    }))
    .pipe(babili({
      mangle: {
        keepClassNames: true
      }
    }))
    .on('error', function (err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    })
    .pipe(gulp.dest(srcOutput + 'js'))
    .pipe(browserSync.reload({
      stream: true
    }))
})

gulp.task('clean', () => {
  return del.sync(srcOutput);
})

gulp.task('browserSync', function () {
  browserSync.init({
    server: {
    baseDir: './'
    },
  })
})

gulp.task('watch', ['browserSync', 'sass', 'scripts', 'fonts', 'images'], () => {
  gulp.watch(srcInput + 'sass/**/*.+(sass|scss)', ['sass']);
  gulp.watch(srcInput + 'img/**/*.+(png|jpg|jpeg|gif|svg)', ['images']);
  gulp.watch(srcInput + 'fonts/**/*', ['fonts']);
  gulp.watch(srcInput + 'js/**/*.js', ['scripts']);
});

gulp.task('default', function (callback) {
  runSequence(['clean', 'watch',  'browserSync'],
    callback
  )
})

// gulp.task('build', function (callback) {
//    runSequence('clean', ['default', 'images', 'fonts'], 'useref', 'scripts',
//      callback)
// })
