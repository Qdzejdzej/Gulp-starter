var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create(),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    del = require('del'),
    runSequence = require('run-sequence');

const babili = require("gulp-babili");

gulp.task('sass', function () {
  return gulp.src('src/sass/**/*.sass')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('images', function () {
  return gulp.src('src/img/**/*.+(png|jpg|jpeg|gif|svg)')
  .pipe(cache(imagemin({
    interlaced: true
   })))
  .pipe(gulp.dest('public/images'))
  .pipe(browserSync.reload({
    stream: true
  }))
});

gulp.task('fonts', function () {
  return gulp.src('src/fonts/**/*')
  .pipe(gulp.dest('public/fonts'))
})

gulp.task('scripts', function () {
  return gulp.src(['src/js/*.js'])
  .pipe(concat('main.min.js'))
  .pipe(babili({
    mangle: {
      keepClassNames: true
    }
  }))
  .on('error', function (err) {
    gutil.log(gutil.colors.red('[Error]'), err.toString());
  })
  .pipe(gulp.dest('public/js'))
  .pipe(browserSync.reload({
    stream: true
  }))
})

gulp.task('clean:dist', () => {
  return del.sync('dist');
})

gulp.task('browserSync', function () {
  browserSync.init({
    server: {
    baseDir: 'public'
    },
  })
})

gulp.task('default', function (callback) {
  runSequence(['watch', 'sass', 'browserSync'],
    callback
  )
})

gulp.task('build', function (callback) {
   runSequence('clean:dist', ['default', 'images', 'fonts'], 'useref', 'scripts',
     callback)
})
