'use strict';

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const server = require('browser-sync').create();
const del  = require('del');

gulp.task('css', function () {
  return gulp.src('src/sass/style.scss')
  .pipe(plumber())
  .pipe(sourcemap.init())
  .pipe(sass())
  .pipe(postcss([autoprefixer()]))
  .pipe(gulp.dest('build/css'))
  .pipe(csso())
  .pipe(rename('style.mine.css'))
  .pipe(gulp.dest('build/css'))
  .pipe(server.stream());
});

gulp.task('clean', function () {
  return del('build');
});

gulp.task('copy', function () {
  return gulp.src([
    'src/fonts/**/*.{woff,woff2}',
    'src/img/**',
    'src/js/**',
  ], {
    base: 'src'
  })
  .pipe(gulp.dest('build'));
});

gulp.task('html', function () {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('build'));
});

gulp.task('server', function () {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.task('refresh', function (done) {
    server.reload();
    done();
  });

  gulp.watch('src/sass/**/*.{scss,sass}', gulp.series('css'));
  gulp.watch('src/*.html', gulp.series('html', 'refresh'));
});

gulp.task('build', gulp.series(
  'clean',
  'copy',
  'css',
  'html'
));

gulp.task('start', gulp.series('build', 'server'));
