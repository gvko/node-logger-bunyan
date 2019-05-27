const gulp = require('gulp');
const tsc = require('gulp-typescript');
const tslint = require('gulp-tslint');

const tsConfigFile = './node_modules/.bin/tsconfig.json';
const tsLintConfigFile = './node_modules/.bin/tslint.json';

const srcGlobTsc = 'src/**/*';
const srcGlobTslint = ['src/**/*.ts', '!src/**/*.d.ts'];
const outDir = 'dist';
const tsProject = tsc.createProject(tsConfigFile);

/*
 * Compile TypeScript
 */
gulp.task('tsc', () => {
  return gulp.src(srcGlobTsc)
    .pipe(tsProject())
    .pipe(gulp.dest(outDir));
});

/*
 * Lint TypeScript
 */
gulp.task('tslint', () => {
  return gulp.src(srcGlobTslint)
    .pipe(tslint({ configuration: tsLintConfigFile }))
    .pipe(tslint.report())
});

/*
 * Run tasks asynchronous
 */
gulp.task('default', gulp.parallel('tslint', 'tsc'));
