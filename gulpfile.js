var gulp = require('gulp')

var glob = require('glob')

var browserify = require('gulp-browserify')
var clean = require('gulp-clean')
var concat = require('gulp-concat')
var flatten = require('gulp-flatten')
var jshint = require('gulp-jshint')
var plumber = require('gulp-plumber')
var react = require('gulp-react')
var rename = require('gulp-rename')
var template = require('gulp-template')
var uglify = require('gulp-uglify')
var gutil = require('gulp-util')

var version = require('./package.json').version
var jsExt = (gutil.env.production ? 'min.js' : 'js')

gulp.task('clean', function() {
  return gulp.src(['./build', './dist'], {read: false})
    .pipe(clean())
})

gulp.task('copy-js-src', function() {
  return gulp.src('./src/**/*.js')
    .pipe(flatten())
    .pipe(gulp.dest('./build/modules'))
})

gulp.task('compile-jsx', function() {
  return gulp.src('./src/**/*.jsx')
    .pipe(plumber())
    .pipe(react())
    .on('error', function(e) {
      console.error(e.message + '\n  in ' + e.fileName)
    })
    .pipe(flatten())
    .pipe(gulp.dest('./build/modules'))
})

gulp.task('lint', ['copy-js-src', 'compile-jsx'], function() {
  return gulp.src('./build/modules/*.js')
    .pipe(jshint('./.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
})

gulp.task('bundle-js', ['lint'], function(){
  var stream = gulp.src(['./build/modules/app.js'])
    .pipe(plumber())
    .pipe(browserify({
      debug: !gutil.env.production
    }))
    .on('prebundle', function(bundle) {
        // Setting cwd as gulp-browserify is forcing browserify's basedir to be
        // the dir containing the entry file.
        glob.sync('*.js', {cwd: './build/modules'}).forEach(function(module) {
          var expose = module.split('.').shift()
          if (expose == 'app') return
          bundle.require('./' + module, {expose: expose})
        })
      })
    .on('error', function(e) {
      console.error(e)
    })
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./build'))

  if (gutil.env.production) {
    stream = stream
      .pipe(rename('app.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./build'))
  }

  return stream
})

gulp.task('dist-js', ['bundle-js'], function() {
  return gulp.src(['./vendor/react-0.8.0.' + jsExt, './build/app.' + jsExt])
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
