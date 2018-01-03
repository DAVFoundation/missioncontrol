const gulp = require('gulp');
const eslint = require('gulp-eslint');
const shell = require('gulp-shell');
const nodemon = require('gulp-nodemon');
const path = require('path');
const jest = require('jest-cli');

const jestConfig = {
  verbose: false,
  rootDir: '.'
};

gulp.task('lint', () => {
  return gulp.src(['**/*.js', '!node_modules/**', '!server/thrift/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('jest', (done) => {
  config: Object.assign(jestConfig, { testMatch: ['**/test/specs/*.js'] })
  }, '.', () => done());
});

gulp.task('jest:thrift', (done) => {
  jest.runCLI({
config: Object.assign(jestConfig, { testMatch: ['**/test/specs/thrift/*.js'] })
  }, '.', () => done());
});

gulp.task('thrift-build', shell.task('npm run thrift'));

gulp.task('watch', ['js', 'thrift'], () =>
  nodemon({
    script: 'server/start-servers.js',
    ext: 'js thrift',
    watch: ['server', 'test', 'resources/idl'],
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

gulp.task('watch:js', ['js'], () =>
  nodemon({
    script: 'server/start-server-web.js',
    ext: 'js',
    watch: ['server', 'test'],
    ignore: [
      'server/thrift',
      'node_modules/'
    ],
    tasks: (changedFiles) => {
      let tasks = [];
      changedFiles.forEach(file => {
        if (path.extname(file) === '.js' && !tasks.includes('js')) tasks.push('js');
      });
      return tasks;
    }
  })
);

gulp.task('js', ['lint', 'jest']);

gulp.task('thrift', ['thrift-build']);

gulp.task('default', ['thrift', 'js']);
