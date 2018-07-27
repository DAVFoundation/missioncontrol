const gulp = require('gulp');
const jest = require('jest-cli');
var ts = require('gulp-typescript');
var tslint = require('gulp-tslint');

gulp.task('jest', (done) => {
    return jest.runCLI({}, '.')
        .on('error', function (err) { done(err); });
});

gulp.task('tslint', (done) => {
    gulp.src('src/**/*.ts')
        .on('error', function (err) { done(err); })
        .pipe(tslint({
            formatter: 'prose'
        }))
        .pipe(tslint.report());
});

gulp.task('tsc', function (done) {
    var tsProject = ts.createProject('tsconfig.json');
    return tsProject.src()
        .pipe(tsProject())
        .on('error', function (err) { done(err); })
        .js
        .pipe(gulp.dest('build'));
});

gulp.task('compile', ['tslint', 'tsc']);
gulp.task('test', ['compile', 'jest']);
