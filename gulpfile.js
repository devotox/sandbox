/* jshint node: true, browser: false */
/* globals require */

'use strict';

const source = 'app',
	destination = 'dist';

const del = require('del');

const gulp = require('gulp');

var webpack = require('webpack-stream');

let runSequence = require('run-sequence');

const browserSync = require('browser-sync').create();

const $ = require('gulp-load-plugins')({
	camelize: true
});

gulp.task('css', () =>  {
	return gulp.src(`${source}/styles/**/*.scss`)
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.sass().on('error', $.sass.logError))
		.pipe($.concat('app.css'))
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest(`${destination}/styles`))
		.pipe(browserSync.stream());
});

gulp.task('js', () => {
	return gulp.src(`${source}/js/**/*.js`)
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe(webpack({
			module: {
				entry: [`${source}/js/index.js`],
				loaders: [{
					test: /.jsx?$/,
					loader: 'babel-loader',
					exclude: /node_modules/,
					query: {
						presets: ['es2015'],
						plugins: ['transform-runtime']
					}
				}]
			},
			output: {
			   filename: '[name].js'
			}
		}))
		.pipe($.concat('app.js'))
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest(`${destination}/js`))
		.pipe(browserSync.stream());
});

gulp.task('hbs', function() {
	return gulp.src(`${source}/templates/**/*.hbs`)
		.pipe($.plumber())
		.pipe($.handlebars({
			handlebars: require('handlebars')
		}))
		.pipe($.wrap('Handlebars.template(<%= contents %>)'))
		.pipe($.declare({
			namespace: 'Templates',
			noRedeclare: true
		}))
		.pipe($.concat('tpls.js'))
		.pipe(gulp.dest(`${destination}/js`))
		.pipe(browserSync.stream());
});

gulp.task('vendor', () => {
	return gulp.src(`${source}/vendor/**/*`)
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.concat('vendor.js'))
		.pipe(gulp.dest(`${destination}/js`))
		.pipe(browserSync.stream());
});

gulp.task('html', () => {
	return gulp.src(`${source}/index.html`)
		.pipe($.plumber())
		.pipe(gulp.dest(`${destination}`))
		.pipe(browserSync.stream());
});

gulp.task('browserSync', () => {
	browserSync.init({
		server: {
			baseDir: destination
		}
	});
});

gulp.task('clean', () => {
	return del([ 'dist' ]);
});

gulp.task('watch', () =>  {
	gulp.start('api-watch');
	gulp.watch(`${source}/js/**/*.js`, ['js-watch']);
	gulp.watch(`${source}/**/*.html`, ['html-watch']);
	gulp.watch(`${source}/styles/**/*.scss`, ['css-watch']);
	gulp.watch(`${source}/vendor/**/*.js`, ['vendor-watch']);
	gulp.watch(`${source}/templates/**/*.hbs`, ['hbs-watch']);
});

gulp.task('js-watch', ['js'], browserSync.reload);

gulp.task('hbs-watch', ['hbs'], browserSync.reload);

gulp.task('css-watch', ['css'], browserSync.reload);

gulp.task('html-watch', ['html'], browserSync.reload);

gulp.task('vendor-watch', ['vendor'], browserSync.reload);

gulp.task('api-watch', $.shell.task([
	`cd ${source}/api && node server.js`
]));

gulp.task('start-api', $.shell.task([
	'node server.js'
]));

gulp.task('default', ['serve']);

gulp.task('start', ['compile', 'start-api']);

gulp.task('compile', ['js', 'hbs', 'css', 'html', 'vendor']);

gulp.task('serve', function(done) {
	return runSequence('clean', 'compile', 'browserSync', 'watch', () => {
		done();
	});
});
