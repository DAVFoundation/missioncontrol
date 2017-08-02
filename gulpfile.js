const gulp = require('gulp');
const eslint = require('gulp-eslint');
const shell = require('gulp-shell');
const nodemon = require('gulp-nodemon');
const path = require('path');

gulp.task('lint', () => {
  return gulp.src(['**/*.js', '!node_modules/**', '!server/thrift/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('thrift', shell.task('npm run thrift'));

gulp.task('watch', ['default'], () =>
  nodemon({
    script: 'server/server-web.js',
    ext: 'js thrift',
    watch: ['server', 'resources/idl'],
    ignore: [
      'server/thrift',
      'node_modules/'
    ],
    tasks: (changedFiles) => {
      let tasks = [];
      changedFiles.forEach(file => {
        if (path.extname(file) === '.js' && !tasks.includes('lint')) tasks.push('lint');
        if (path.extname(file) === '.thrift' && !tasks.includes('thrift')) tasks.push('thrift');
      });
      return tasks;
    }
  })
);

gulp.task('default', ['lint']);
