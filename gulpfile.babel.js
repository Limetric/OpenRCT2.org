import gulp from 'gulp';
import size from 'gulp-size';
import log from 'gulplog';
import del from 'del';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import sass from 'gulp-sass';
import autoprefixer from 'autoprefixer';
import postcss from 'gulp-postcss';
import cssnano from 'cssnano';
import flexbugsFixes from 'postcss-flexbugs-fixes';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';

const paths = {
    src: {
        scripts: 'frontend/js',
        vendorScripts: 'frontend/js/vendor',
        styles: 'frontend/sass'
    },
    dist: 'public/resources'
};

const jsBundleName = 'app';
const cssBundleName = 'app';

const cleanScripts = () => {
    return del([
        `${paths.dist}/${jsBundleName}.bundle.min.js`,
        `${paths.dist}/${jsBundleName}.bundle.min.js.map`,
    ]);
};

const cleanStyles = () => {
    return del([
        `${paths.dist}/${cssBundleName}.min.css`,
        `${paths.dist}/${cssBundleName}.min.css.map`,
    ]);
};

const clean = gulp.parallel(cleanScripts, cleanStyles);
clean.description = 'removes dist files';

const compileScripts = () => {
    const uglify = require('gulp-uglify-es').default;

    const b = browserify({
            debug: true
        })
        .transform(babelify)
        .require(`./${paths.src.scripts}/${jsBundleName}.js`, {
            entry: true
        });

    return b
        .bundle()
        .pipe(source(`${jsBundleName}.bundle.min.js`))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(uglify())
        .on('error', log.error)
        .pipe(sourcemaps.write('./'))
        .pipe(size({
            showFiles: true
        }))
        .pipe(gulp.dest(paths.dist));
};

const compileStyles = () => {
    const postcssPlugins = [
        flexbugsFixes(),
        autoprefixer({
            browsers: ['last 2 versions']
        }),
        cssnano({
            preset: ['default', {
                discardComments: {
                    removeAll: true,
                }
            }]
        })
    ];

    const sourceFiles = `${paths.src.styles}/${cssBundleName}.scss`;

    return gulp.src(sourceFiles)
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
};

const compile = gulp.parallel(compileScripts, compileStyles);

const watchScripts = () => {
    gulp.watch(paths.src.scripts + '/**/*.js', gulp.series(cleanScripts, compileScripts));
};

const watchStyles = () => {
    gulp.watch(paths.src.styles + '/**/*.{css,scss}', gulp.series(cleanStyles, compileStyles));
};

const watch = gulp.parallel(watchScripts, watchStyles);
watch.description = 'watch for changes to all source';

export {
    clean,
    cleanStyles,
    cleanScripts,
    compile,
    compileScripts,
    compileStyles,
    watch,
    watchScripts,
    watchStyles
};

const defaultTasks = gulp.parallel(gulp.series(clean, compile), watch);
export default defaultTasks;