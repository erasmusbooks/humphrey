var gulp = require('gulp'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	gutil = require('gulp-util'),
	less = require('gulp-less'),
	autoprefixer = require('gulp-autoprefixer'),
	minifyCSS = require('gulp-minify-css'),
	path = require('path'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	browserify = require('browserify'),
	babelify = require('babelify');

var dependencies = ['react', 'react-dom', 'jquery', 'fullcalendar', 'underscore'];
var scriptsCount = 0;

gulp.task('bundle', function () { bundleApp(true); });

gulp.task('less', function () {
	gulp.src('./styles/main.less')
		.pipe(less({ 
			paths: [ './styles/*.css' ],
			compress: true
		}))
		.pipe(autoprefixer('last 10 versions', 'ie 9'))
		.pipe(minifyCSS({ keepBreaks: false }))
		.pipe(gulp.dest('./styles/'))
		.pipe(rename('./style.min.css'))
		.pipe(gulp.dest('./styles/'));
});

gulp.task('watch', function () {
	gulp.watch('./scripts/univ/**/*.js', ['bundle']);
	gulp.watch('./scripts/dash/**/*.js', ['bundle']);
	gulp.watch('./scripts/news/**/*.js', ['bundle']);
	gulp.watch('./scripts/cal/**/*.jsx', ['bundle']);
	gulp.watch('./styles/**/*.less', ['less']);
});

gulp.task('default', ['bundle', 'less', 'watch']);

function bundleApp(isProduction) {
	scriptsCount++;
	
	var universalBundler = browserify({
		entries: './scripts/univ/universal.js',
		debug: true
	})

	var dashboardBundler = browserify({
		entries: './scripts/dash/dashboard.js',
		debug: true
	})

	var newsBundler = browserify({
		entries: './scripts/news/news.js',
		debug: true
	})

	var calendarBundler = browserify({
		entries: './scripts/cal/cal-app.react.jsx',
		debug: true
	})


	if (!isProduction && scriptsCount === 1) {
		browserify({
			require: dependencies,
			debug: true
		})
		.bundle()
		.on('error', gutil.log)
		.pipe(source('vendors.js'))
		.pipe(gulp.dest('./scripts/'));
	}

	if (!isProduction) {
	
		dependencies.forEach(function (dep) {
			universalBundler.external(dep);
			dashboardBundler.external(dep);
			newsBundler.external(dep);
			calendarBundler.external(dep);
		})
	}

	universalBundler
		.transform('babelify', {presets: ['es2015']})
		.bundle()
		.on('error',gutil.log)
		.pipe(source('universal.js'))
		.pipe(gulp.dest('./scripts/'));

	dashboardBundler
		.transform('babelify', {presets: ['es2015']})
		.bundle()
		.on('error',gutil.log)
		.pipe(source('dashboard.js'))
		.pipe(gulp.dest('./scripts/'));

	newsBundler
		.transform('babelify', {presets: ['es2015']})
		.bundle()
		.on('error',gutil.log)
		.pipe(source('news.js'))
		.pipe(gulp.dest('./scripts/'));

	calendarBundler
		.transform('babelify', {presets: ['es2015', 'react']})
		.bundle()
		.on('error',gutil.log)
		.pipe(source('calendar.js'))
		.pipe(gulp.dest('./scripts/'));
}