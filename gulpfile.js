'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var writ = require('gulp-writ');
var eslint = require('gulp-eslint');
var stylelint = require('gulp-stylelint');
var connect = require('gulp-connect');
var fixme = require('fixme');
var del = require('del');
var _ = require('underscore');

var config = require('./build.config');

gulp.task('clean', function(callback) {
  return del([
      config.dir.src +'**/*',
      '!'+ config.dir.src,
      config.dir.build +'**/*',
      '!'+ config.dir.build
    ],
    { force: true },
    callback)
  ;
});

gulp.task('generate', [ 'clean' ], function() {
  return gulp.src(config.files.doc)
    .pipe(writ().on('error', gutil.log))
    .pipe(gulp.dest(config.dir.src))
  ;
});

gulp.task('lint:config', function() {
  return gulp.src(config.files.config)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
  ;
});

gulp.task('lint:sass', function() {
  return gulp.src(config.files.css)
    .pipe(stylelint({
      reporters: [ { formatter: 'string', console: true } ],
    }))
  ;
});

gulp.task('lint:javascript', function() {
  return gulp.src(config.files.js)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
  ;
});

gulp.task('lint', [ 'lint:config', 'lint:sass', 'lint:javascript' ]);

gulp.task('default', [ 'generate' ], function() {
  return gulp.start('lint').on('task_stop', gutil.noop);
});

gulp.task('fixme', _.partial(fixme, {
  file_patterns: [ '**/*.js', '**/*.scss' ],
  ignored_directories: [ 'node_modules/**', '.git/**', 'dist/**' ],
}));

gulp.task('watch', [ 'default' ], function() {
  gulp.watch(config.files.config, [ 'lint:config' ]);
  gulp.watch(config.files.css, [ 'sass' ]);
  gulp.watch(config.files.js, [ 'javascript', 'spec' ]);
  gulp.watch(config.files.spec, [ 'spec' ]);
  gulp.watch(config.files.doc, [ 'generate' ]);

  connect.server({
    root: [ 'dist' ],
    port: 8889,
    livereload: false,
  });
});

/*
  eslint-env node
*/

/*
  eslint camelcase:0
*/

