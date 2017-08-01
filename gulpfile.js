const gulp = require('gulp');
const eslint = require('gulp-eslint');
const shell = require('gulp-shell');

gulp.task('lint', () => {
  return gulp.src(['**/*.js', '!node_modules/**', '!server/thrift/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('thrift', shell.task('npm run thrift'));

gulp.task('watch', ['default'], () => {
  gulp.watch(['server/**/*.js', '!server/thrift/**'], ['lint']);
  gulp.watch('resources/idl/*.thrift', ['thrift']);
});

gulp.task('default', ['lint']);
