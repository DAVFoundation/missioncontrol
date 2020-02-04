const gulp = require('gulp');
const jest = require('gulp-jest').default;
var ts = require('gulp-typescript');
var tslint = require('gulp-tslint');
const spellcheck = require('gulp-ts-spellcheck').default;

gulp.task('jest', done => {
  return gulp
    .src('jest.config.js')
    .on('error', function(err) {
      done(err);
    })
    .pipe(jest({}));
});

gulp.task('tslint', done => {
  return gulp
    .src('src/**/*.ts')
    .on('error', function(err) {
      done(err);
    })
    .pipe(
      tslint({
        formatter: 'prose',
      }),
    )
    .pipe(tslint.report());
});

gulp.task('spellcheck', function(done) {
  return gulp
    .src('src/**/*.ts')
    .on('error', function(err) {
      done(err);
    })
    .pipe(
      spellcheck({
        dictionary: require('./speller-dictionary.js'),
      }),
    )
    .pipe(spellcheck.report({}));
});

gulp.task('tslint', done => {
  return gulp
    .src('src/**/*.ts')
    .on('error', function(err) {
      done(err);
    })
    .pipe(
      tslint({
        formatter: 'prose',
      }),
    )
    .pipe(tslint.report());
});

gulp.task('spellcheck', function(done) {
  return gulp
    .src('src/**/*.ts')
    .on('error', function(err) {
      done(err);
    })
    .pipe(
      spellcheck({
        dictionary: require('./speller-dictionary.js'),
      }),
    )
    .pipe(spellcheck.report({}));
});

gulp.task('tsc', function(done) {
  var tsProject = ts.createProject('tsconfig.json');
  return tsProject
    .src()
    .pipe(tsProject())
    .on('error', function(err) {
      done(err);
    })
    .js.pipe(gulp.dest('build'));
});

gulp.task('compile', gulp.series('tslint', 'tsc'));
gulp.task('test', gulp.series('compile', 'jest'));
