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
const _G = require('gulp-load-plugins');

const DIST_DIR = 'web_deploy';
const DEFAULT_DEBUG_SCOPE = 'mark-openapi:*'
const project = require('./gulp-project.json');
// const { env: ENVIRONMENT } = require('./localconfig.json');

// load settings
const pkg = require('./package.json');
if (!pkg) {
  console.log('Could not find package.json!');
  // process.exit(1);
}

// DO NOT CHANGE DEFAULT TASK - Azure depends on it
gulp.task('default', false, defaultTask);

function defaultTask(callback) {
  gulpSequence('debug', callback);
}

gulp.task('publish', ['build'], debugTask)
gulp.task('debug', ['build'], debugTask)
gulp.task('debug-all', ['build', 'edit'], debugTask)

function debugTask(debug, port) {
  const debugScope = debug || DEFAULT_DEBUG_SCOPE;
  const args = {
    script: `index.js`,
    ext: 'js',
    env: {},
    watch: project.watch,
    ignore: project.ignore
  };

  if (port)
    args.env.PORT = port;
  args.env.DEBUG = debugScope;

  util.log(util.colors.green('Mark OpenAPI docs starting http://localhost:' + args.env.PORT));
  _G().nodemon(args);
}

gulp.task('edit', function () {
  portfinder.getPort({ port: 5000 }, function (err, port) {
    var app = connect();
    app.use(swaggerRepo.swaggerEditorMiddleware());
    app.listen(port);
    util.log(util.colors.green('swagger-editor started http://localhost:' + port));
  });
});

gulp.task('install', [], installTask);
function installTask() {
  // install dependencies
}

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
