const { src, dest, watch, parallel } = require('gulp')
const autoprefixer = require('autoprefixer')
const postcss = require('gulp-postcss')
const cssnano = require('cssnano')
const sourcemaps = require('gulp-sourcemaps')
const sass = require('gulp-sass')
const htmlclean = require('gulp-htmlclean')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')
const browserSync = require('browser-sync')


// Function to minify html files
function html() {
  return src('src/*.html')
    .pipe(htmlclean())
    .pipe(dest('prod'))
    .pipe(browserSync.stream())
}

exports.html = html


// Function to minify css and process scss
function css() {
  return src('src/styles/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([ autoprefixer(), cssnano() ]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('prod/css'))
    .pipe(browserSync.stream())
}

exports.css = css


// Function to minify javascript
function js() {
  return src('src/js/*.js')
    .pipe(babel({
      "presets": ["@babel/preset-env"]
    }))
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(dest('prod/js'))
    .pipe(browserSync.stream())
}

exports.js = js


// Function to watch all tasks
function watchTask() {
  browserSync.init({
    server: {
      baseDir: 'prod'
    }
  })
  watch('src/*.html', html).on('change', browserSync.reload)
  watch('src/styles/**/*.scss', css)
  watch('src/js/*.js', js).on('change', browserSync.reload)
}

exports.watchTask = watchTask // gulp watchTask

// Run just for a build 
exports.build = parallel(html, css, js) // gulp build
