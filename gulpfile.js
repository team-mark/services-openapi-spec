const gulp =
  require('gulp-help')(require('gulp-param')(require('gulp'), process.argv));
const util = require('gulp-util')
const gulpConnect = require('gulp-connect');
const connect = require('connect');
const cors = require('cors');
const exec = require('child_process').exec;
const portfinder = require('portfinder');
const swaggerRepo = require('swagger-repo');
const gulpSequence = require('gulp-sequence');
const gulpNodemon = require('gulp-nodemon');

var DIST_DIR = 'web_deploy';

// load settings
const pkg = require('./package.json');
if (!pkg) {
  console.log('Could not find package.json!');
  // process.exit(1);
}

// DO NOT CHANGE DEFAULT TASK - Azure depends on it
gulp.task('default', false, defaultTask);

function defaultTask(callback) {
  gulpSequence('publish', callback);
}

gulp.task('develop', ['build', 'watch', 'edit'], function () {
  portfinder.getPort({ port: 3000 }, function (err, port) {
    gulpConnect.server({
      root: [DIST_DIR],
      livereload: true,
      port: port,
      middleware: function (gulpConnect, opt) {
        return [
          cors()
        ]
      }
    });
  });
});

gulp.task('publish', ['build'], function () {
  return portfinder.getPort({ port: 80 }, function (err, port) {
    return gulpConnect.server({
      root: [DIST_DIR],
      livereload: true,
      port: port,
      middleware: function (gulpConnect, opt) {
        return [
          cors()
        ]
      }
    });
  });
});

gulp.task('edit', function () {
  portfinder.getPort({ port: 5000 }, function (err, port) {
    var app = connect();
    app.use(swaggerRepo.swaggerEditorMiddleware());
    app.listen(port);
    util.log(util.colors.green('swagger-editor started http://localhost:' + port));
  });
});

gulp.task('build', function (callback) {
  exec('npm run build', function (err, stdout, stderr) {
    console.log(stderr);
    callback(err);
  });
});

gulp.task('reload', ['build'], function () {
  gulp.src(DIST_DIR).pipe(gulpConnect.reload())
});

gulp.task('watch', function () {
  gulp.watch(['spec/**/*', 'web/**/*'], ['reload']);
});
