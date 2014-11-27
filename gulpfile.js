var path = require('path')

var browserify = require('browserify')
var del = require('del')
var glob = require('glob')
var gulp = require('gulp')
var source = require('vinyl-source-stream')

var concat = require('gulp-concat')
var flatten = require('gulp-flatten')
var jshint = require('gulp-jshint')
var plumber = require('gulp-plumber')
var react = require('gulp-react')
var rename = require('gulp-rename')
var streamify = require('gulp-streamify')
var template = require('gulp-template')
var uglify = require('gulp-uglify')
var gutil = require('gulp-util')

process.env.NODE_ENV = gutil.env.production ? 'production' : 'development'

var version = require('./package.json').version
var jsSrc = ['./src/**/*.js', './src/**/*.jsx']
var jsExt = (gutil.env.production ? 'min.js' : 'js')

gulp.task('clean', function(cb) {
  del(['./build/**/*', './dist/**/*'], cb)
})

gulp.task('transpile-js', function() {
  return gulp.src(jsSrc)
    .pipe(plumber())
    .pipe(react({
      harmony: true
    }))
    .pipe(flatten())
    .pipe(gulp.dest('./build/modules'))
})

gulp.task('lint', ['transpile-js'], function() {
  return gulp.src('./build/modules/*.js')
    .pipe(jshint('./.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
})

gulp.task('bundle-js', ['lint'], function() {
  var b = browserify('./build/modules/app.js', {
    debug: !gutil.env.production
  , detectGlobals: false
  })
  b.external('react')

  // Expose each module as a bare require, because
  glob.sync('./build/modules/*.js').forEach(function(module) {
    var expose = module.split('/').pop().split('.').shift()
    if (expose != 'app') {
      b.require(module, {expose: expose})
    }
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

gulp.task('bundle-deps', function() {
  var b = browserify({detectGlobals: false})
  b.require('react')
  b.transform('envify')

  var stream = b.bundle()
    .pipe(source('deps.js'))
    .pipe(gulp.dest('./build'))

  if (gutil.env.production) {
    stream = stream.pipe(rename('deps.min.js'))
      .pipe(streamify(uglify()))
      .pipe(gulp.dest('./build'))
  }

  return stream
})

gulp.task('dist-js', ['bundle-js'], function() {
  return gulp.src('./build/app.' + jsExt)
    .pipe(gulp.dest('./dist/js'))
})

gulp.task('dist-deps', ['bundle-deps'], function() {
  return gulp.src('./build/deps.' + jsExt)
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

gulp.task('dist', ['dist-js', 'dist-deps', 'dist-css', 'dist-html'])

gulp.task('watch', function() {
  gulp.watch(jsSrc, ['dist-js'])
  gulp.watch('./public/css/*.css', ['dist-css'])
  gulp.watch('./public/index.html', ['dist-html'])
})

gulp.task('default', ['dist', 'watch'])
