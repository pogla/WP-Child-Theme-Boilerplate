var gulp = require('gulp');
var livereload = require('gulp-livereload')
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');

function compile(watch) {
  var bundler = watchify(browserify('./js/lib/custom.js', { debug: true }).transform(babel));

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('build.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./js/dist/'));
  }

  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
    });
  }

  rebundle();
}

function watch() {
  return compile(true);
};

gulp.task('imagemin', function () {
    return gulp.src('includes/images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('includes/dist/images'));
});

gulp.task('sass', function() {

    gulp.src('sass/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(sourcemaps.write(''))
    .pipe(gulp.dest(''))

});

gulp.task('js', function() {

  browserify('./js/lib/custom.js')
  .bundle().on('error', function(e) {
    gutil.log(e);
  })
  .pipe(source('custom.js'))
  .pipe(babel({
    presets: ['es2015']
  }))
  .pipe(gulp.dest("./js/dist"))

});

gulp.task('js', function() { return watch(); });

gulp.task('default', function(){

    livereload.listen();
    gulp.watch('sass/**/*.scss', ['sass']);
    gulp.watch('js/lib/**/*.js', ['js']);
    gulp.watch(['style.css', '**/*.php', 'js/lib/**/*.js'], function (files){
        livereload.changed(files)
    });

});

gulp.task('build', ['sass', 'js', 'imagemin']);