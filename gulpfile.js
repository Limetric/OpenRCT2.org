const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const size = require('gulp-size');
const log = require('gulplog');

// we define some constants here so they can be reused
const paths = {
    src: {
        scripts: 'frontend/js',
        vendorScripts: 'frontend/js/vendor',
        styles: 'frontend/sass'
    },
    dist: 'public/resources'
};

const jsBundleName = 'app.bundle.min.js';

gulp.task('clean:scripts', () => {
    return del([
        `${paths.dist}/${jsBundleName}`,
        `${paths.dist}/${jsBundleName}.map`
    ]);
});

gulp.task('clean:styles', () => {
    return del([
        `${paths.dist}/style.min.css`,
        `${paths.dist}/style.min.css.map`
    ]);
});

const browserify = require('browserify');
const babelify = require('babelify');
//const babel = require('gulp-babel');

gulp.task('scripts', ['clean:scripts'], () => {
    //const uglify = require('gulp-uglify');
    const uglify = require('gulp-uglify-es').default;
    //const minify = require('gulp-babel-minify');

    try {
        return browserify(`${paths.src.scripts}/app.js`, {
            debug: true //Enable Source Maps
        })
            .transform(babelify, {
                sourceMaps: true //Set to false to get post-transpiled Source Maps
            })
            .bundle()
            .pipe(source(jsBundleName))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(uglify())
            .on('error', log.error)
            .pipe(sourcemaps.write('./'))
            .pipe(size({
                showFiles: true
            }))
            .pipe(gulp.dest(paths.dist));
    } catch (error) {
        log.error(error);
    }
    //.pipe(fs.createWriteStream('bundle.js'));

});

gulp.task('styles', ['clean:styles'], () => {
    const sass = require('gulp-sass');
    const autoprefixer = require('autoprefixer');
    const postcss = require('gulp-postcss');
    const cssnano = require('cssnano');
    const flexbugsFixes = require('postcss-flexbugs-fixes');

    const postcssPlugins = [
        flexbugsFixes(),
        autoprefixer({browsers: ['last 2 versions']}),
        cssnano({
            preset: ['default', {
                discardComments: {
                    removeAll: true,
                }
            }]
        })
    ];

    const rename = require('gulp-rename');

    try {
        return gulp.src(
            paths.src.styles + '/style.scss')
            .pipe(sourcemaps.init())
            .pipe(sass(/*{
                outputStyle: 'compressed'
            }*/).on('error', sass.logError))
            .pipe(postcss(postcssPlugins))
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(sourcemaps.write('./'))
            .pipe(size({
                showFiles: true
            }))
            .pipe(gulp.dest(paths.dist));
    } catch (error) {
        log.error(error);
    }
});


gulp.task('watch', () => {
    gulp.watch(paths.src.scripts + '/**/*.js', ['scripts']);
    //gulp.watch(paths.src.scripts +'/*.js', ['scripts']);
    gulp.watch(paths.src.styles + '/**/*.{css,scss}', ['styles']);
    //gulp.watch(paths.src.styles +'/*.{css,scss}', ['styles']);
});

gulp.task('clean', ['clean:styles', 'clean:scripts']);
gulp.task('dist', ['scripts', 'styles']);
gulp.task('default', ['watch', 'dist']);