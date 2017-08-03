const gulp = require('gulp');
const eslint = require('gulp-eslint');
const shell = require('gulp-shell');
const nodemon = require('gulp-nodemon');
const jest = require('gulp-jest').default;
const path = require('path');

gulp.task('lint', () => {
  return gulp.src(['**/*.js', '!node_modules/**', '!server/thrift/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('jest', () => {
  return gulp.src(['test/specs/**/*.spec.js'])
    .pipe(jest());
});

gulp.task('thrift-build', shell.task('npm run thrift'));

gulp.task('watch', ['js', 'thrift'], () =>
  nodemon({
    script: 'server/start-server-web.js',
    ext: 'js thrift',
    watch: ['server', 'resources/idl'],
    ignore: [
      'server/thrift',
      'node_modules/'
    ],
    tasks: (changedFiles) => {
      let tasks = [];
      changedFiles.forEach(file => {
        if (path.extname(file) === '.js' && !tasks.includes('js')) tasks.push('js');
        if (path.extname(file) === '.thrift' && !tasks.includes('thrift')) tasks.push('thrift');
      });
      return tasks;
    }
  })
);

gulp.task('js', ['lint', 'jest']);

gulp.task('thrift', ['thrift-build']);

gulp.task('default', ['thrift', 'js']);
