const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync =require('browser-sync');
const htmlhint = require('gulp-htmlhint');
const eslint = require('gulp-eslint');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const ejs = require( 'gulp-ejs' );
const rename = require("gulp-rename");
const htmlbeautify = require('gulp-html-beautify');
const cmq = require('gulp-combine-media-queries');
const csscomb = require('gulp-csscomb');

const beautify_options = {
    'indent_with_tabs':true
}


//HTML
gulp.task('html', function() {
    gulp.src('doc/**/*.html')
        .pipe(htmlhint())
        .pipe(htmlbeautify(beautify_options))
        .pipe(gulp.dest('doc/'))
        .pipe(htmlhint.reporter())
        .pipe(browserSync.stream());
});

//SASS
gulp.task('sass', function () {
    // style.scssファイルを取得
    gulp.src('src/sass/**.scss')
        .pipe(plumber())
    // Sassのコンパイルを実行
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(cmq())
        .pipe(csscomb())
        // cssフォルダー以下に保存
        .pipe(gulp.dest('doc/css'))
        .pipe(browserSync.stream());
});

//eslint
gulp.task('script', function(){
    gulp.src('src/js/*.js')
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        })) //(＊2)
        .pipe(eslint()) //(＊3)
        .pipe(eslint.format()) //(＊4)
        .pipe(eslint.failAfterError()) //(＊5)
        .pipe(browserSync.stream());
});

//EJS
gulp.task("ejs", function() {
    gulp.src(
        ["src/ejs/**/*.ejs",'!' + "src/ejs/**/_*.ejs"]
    )
        .pipe(ejs())
        .pipe(rename({extname: ".html"})) //拡張子をhtmlに
        .pipe(gulp.dest("doc/")) //出力先
});

//browser
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./doc"
        }
    });
});

gulp.task("default", function () {
    browserSync({
        server: {
            baseDir: "./doc/"
        }
    });

    gulp.watch('src/sass/*.scss',['sass']);
    gulp.watch('doc/**/*.html',['html']);
    gulp.watch('doc/js/*.js',['script']);
    gulp.watch('src/ejs/**/*.ejs',['ejs']);
});