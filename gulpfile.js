const gulp = require('gulp');
const jest = require('jest-cli');
var ts = require('gulp-typescript');
var tslint = require('gulp-tslint');

gulp.task('jest', () => {
    return jest.runCLI({}, '.');
});

gulp.task('tslint', () =>
    gulp.src('src/**/*.ts')
        .pipe(tslint({
            formatter: 'prose'
        })).pipe(tslint.report({
            emitError: false
        }))
);

gulp.task('tsc', function () {
    var tsProject = ts.createProject('tsconfig.json');
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('build'));
});

gulp.task('compile', ['tslint', 'tsc']);
gulp.task('test', ['compile', 'jest']);