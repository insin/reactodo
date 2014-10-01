var path = require('path')

var gulp = require('gulp')

var browserify = require('browserify')
var glob = require('glob')
var react = require('react-tools')
var source = require('vinyl-source-stream')
var through = require('through2')

var concat = require('gulp-concat')
var flatten = require('gulp-flatten')
var jshint = require('gulp-jshint')
var plumber = require('gulp-plumber')
var rename = require('gulp-rename')
var rimraf = require('gulp-rimraf')
var streamify = require('gulp-streamify')
var template = require('gulp-template')
var uglify = require('gulp-uglify')
var gutil = require('gulp-util')

function jsx(name) {
  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      return cb(null, file)
    }

    if (file.isStream()) {
      return cb(new gutil.PluginError('jsx', 'Streaming not supported'))
    }

    var contents = file.contents.toString()
    if (path.extname(file.path) === '.jsx' && !(/\*\s*@jsx/.test(contents))) {
      contents = '/** @jsx React.DOM */\n' + contents
    }
    var originalPath = file.path

    try {
      file.contents = new Buffer(react.transform(contents))
      file.path = gutil.replaceExtension(originalPath, '.js')
      cb(null, file)
    }
    catch (e) {
      cb(new gutil.PluginError('jsx', e, {
        fileName: originalPath
      }))
    }
  })
}

var version = require('./package.json').version
var jsExt = (gutil.env.production ? 'min.js' : 'js')

gulp.task('clean', function(cb) {
  rimraf()
  return gulp.src(['./build', './dist'], {read: false})
    .pipe(rimraf())
})

gulp.task('copy-js-src', function() {
  return gulp.src('./src/**/*.js')
    .pipe(flatten())
    .pipe(gulp.dest('./build/modules'))
})

gulp.task('transpile-jsx', function() {
  return gulp.src('./src/**/*.jsx')
    .pipe(plumber())
    .pipe(jsx())
    .on('error', function(e) {
      console.error(e.message + '\n  in ' + e.fileName)
    })
    .pipe(flatten())
    .pipe(gulp.dest('./build/modules'))
})

gulp.task('lint', ['copy-js-src', 'transpile-jsx'], function() {
  return gulp.src('./build/modules/*.js')
    .pipe(jshint('./.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
})

gulp.task('bundle-js', ['lint'], function() {
  var b = browserify('./build/modules/app.js', {debug: !gutil.env.production})

  glob.sync('./build/modules/*.js').forEach(function(module) {
    var expose = module.split('/').pop().split('.').shift()
    if (expose == 'app') return
    b.require(module, {expose: expose})
  })

  var stream = b.bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./build'))

  if (gutil.env.production) {
    stream = stream
      .pipe(rename('app.min.js'))
      .pipe(streamify(uglify()))
      .pipe(gulp.dest('./build'))
  }

  return stream
})

gulp.task('dist-js', ['bundle-js'], function() {
  return gulp.src(['./vendor/react-*.*.*.' + jsExt, './build/app.' + jsExt])
    .pipe(gulp.dest('./dist/js'))
})

gulp.task('dist-css', function() {
  return gulp.src('./public/css/*.css')
    .pipe(gulp.dest('./dist/css'))
})

gulp.task('dist-html', function() {
  return gulp.src('./public/index.html')
    .pipe(template({
      version: version
    , jsExt: jsExt
    }))
    .pipe(gulp.dest('./dist'))
})

gulp.task('watch', function() {
  gulp.watch(['./src/**/*.js', './src/**/*.jsx'], ['dist-js'])
  gulp.watch('./public/css/*.css', ['dist-css'])
  gulp.watch('./public/index.html', ['dist-html'])
})

gulp.task('default', ['clean'], function() {
  gulp.start('dist-js', 'dist-css', 'dist-html', 'watch')
})
