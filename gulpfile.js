const gulp = require('gulp');
const eslint = require('gulp-eslint');

gulp.task('lint', () => {
  return gulp.src(['**/*.js', '!node_modules/**', '!server/thrift/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('watch', ['default'], () => {
  gulp.watch(['server/**/*.js', '!server/thrift/**'], ['lint']);
});

gulp.task('default', ['lint']);
