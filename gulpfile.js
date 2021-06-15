'use strict';
const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');

gulp.task('sass', function () {
   return gulp.src('./sass/**/*.scss')
      .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
      .pipe(gulp.dest('./dist/'));
});

gulp.task('sass:watch', function () {
   gulp.watch('./sass/**/*.scss', gulp.series('sass'));
});