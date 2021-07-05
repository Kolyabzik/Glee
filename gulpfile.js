const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const del = require('del');

// Функция обновления страницы в браузере
function browsersync() {
	browserSync.init({
		server: {
			baseDir: 'app/'
		},
		notify: false
	});
}

// Функция обработки стилей
function styles() {
	return src('app/scss/style.scss')
		.pipe(scss({
			outputStyle: 'compressed'
		}).on('error', scss.logError))
		.pipe(concat('style.min.css'))
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 5 versions'],
			grid: true,
			cascade: false
		}))
		.pipe(dest('app/css'))
		.pipe(browserSync.stream())
}

// Функция обработки скриптов
function scripts() {
	return src([
		'node_modules/jquery/dist/jquery.js',
		'node_modules/slick-carousel/slick/slick.js',
		'node_modules/@fancyapps/ui/dist/fancybox.umd.js',
		'node_modules/mixitup/dist/mixitup.js',
		'app/js/main.js'
	])
		.pipe(concat('main.min.js'))
		.pipe(uglify())
		.pipe(dest('app/js'))
		.pipe(browserSync.stream())
}

// Функция обработки изображений
function images() {
	return src('app/img/**/*.*')
		.pipe(imagemin([
			imagemin.gifsicle({ interlaced: true }),
			imagemin.mozjpeg({ quality: 75, progressive: true }),
			imagemin.optipng({ optimizationLevel: 5 }),
			imagemin.svgo({
				plugins: [
					{ removeViewBox: true },
					{ cleanupIDs: false }
				]
			})
		]))
		.pipe(dest('dist/img'))
}

function build() {
	return src([
		'app/**/*.html',
		'app/css/style.min.css',
		'app/js/main.min.js'
	], { base: 'app' })
		.pipe(dest('dist'))
}

function clean() {
	return del('dist')
}

// Функиця слежения за изменениями
function watching() {
	watch(['app/scss/**/*.scss'], styles);
	watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
	watch(['app/**/*.html']).on('change', browserSync.reload)
}


exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.watching = watching;
exports.images = images;
exports.clean = clean;

exports.build = series(clean, images, build);
exports.default = parallel(styles, scripts, browsersync, watching);