var gulp = require('gulp');
var webpack = require('webpack-stream');

gulp.task("build", ['webpack'], function(callback) {
  return gulp.src('app/src/html/index.html')
        .pipe(gulp.dest('dist/'));
});

gulp.task("webpack", function(callback) {
  return gulp.src('app/src/entry.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('dist/'));
});
