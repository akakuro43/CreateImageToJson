/**
 * gulpfile.js
 *
 * タスクランナーにgulpを使用する。
 * PUG...pugコンパイル
 * SASS...コンパイル、ベンダープレフィックスの付与、csslint、メディアクエリ整頓
 * JS...ES2017(Babel)をトランスパイル
 * IMAGE...ファイル圧縮
 * Server...ローカルサーバ起動
 * AutoReload...オートリロード
 */

/*------------------------------------------------------------
 使用するモジュール
 ------------------------------------------------------------*/
 const gulp = require('gulp'),
       sass = require('gulp-sass'),
       plumber = require('gulp-plumber'),
       autoprefixer = require('gulp-autoprefixer'),
       csscomb = require('gulp-csscomb'),
       csslint = require('gulp-csslint'),
       minifyCss = require('gulp-minify-css'),
       notify = require('gulp-notify'),
       mergeMediaQueries = require('gulp-merge-media-queries')
       imagemin = require('gulp-imagemin'),
       webpack = require('gulp-webpack'),
       webpackConfig = require('./webpack.config.js'),
       del = require('del'),
       watch = require('gulp-watch'),
       babel = require('gulp-babel'),
       runSequence = require('run-sequence'),
       htmlhint = require("gulp-htmlhint"),
       rename = require('gulp-rename'),
       filter = require('gulp-filter'),
       browserSync = require('browser-sync').create(),
       exec = require('gulp-exec'),
       pug = require('gulp-pug'),
       fs = require('fs'),
       rimraf = require('rimraf'),
       svgmin = require('gulp-svgmin'),
       iconfontCss = require('gulp-iconfont-css'),
       pngquant = require('imagemin-pngquant'),
       mozjpeg = require('imagemin-mozjpeg'),
       iconfont = require('gulp-iconfont');

/*------------------------------------------------------------
 IN/OUTの各パスの定義
 ------------------------------------------------------------*/
const PROJECT_NAME = 'CIJ';
const SRC = './src/',
      DEST = './dest/'+PROJECT_NAME+'/',
      SASS_SRC = './src/sass/**/*.sass',
      SASS_DEST = './dest/'+PROJECT_NAME+'/assets/css',
      PUG_SRC = './src/html/',
      PUG_DEST = './dest/'+PROJECT_NAME+'/',
      JS_SRC = './src/js/**/*.js',
      JS_DEST = './dest/'+PROJECT_NAME+'/assets/js/',
      JS_ENDOR_SRC = './src/js/vendor/*.js',
      JS_ENDOR_DEST = './dest/'+PROJECT_NAME+'/assets/js/vendor',
      IMG_SRC = './src/images/**/*',
      IMG_DEST = './dest/'+PROJECT_NAME+'/assets/images',
      ICON_SRC = './src/icons/',
      FONTS_SRC = './src/fonts/',
      FONTS_DEST = './dest/'+PROJECT_NAME+'/assets/fonts',
      SERVER_START_PATH = 'dest/' + PROJECT_NAME + '/';

/*------------------------------------------------------------
 設定
------------------------------------------------------------*/
// オートリロードのON/OFF
const IS_AUTO_RELOAD = true;

// 開発時のブラウザー
const BROWSER_AT_DEVELOP = 'Google Chrome';

// ベンダープレフィックスのバージョン指定
const AUTOPREFIXER_OPTIONS = {
      browsers: ['last 2 version']
      // browsers: ['last 3 version', 'Android 4.0']
};

/*------------------------------------------------------------
 PUGのコンパイル
------------------------------------------------------------*/
gulp.task('pug', () => {
  return gulp.src([PUG_SRC + '**/*.pug', '!' + PUG_SRC + '**/_*.pug'])
    .pipe(plumber()).pipe(pug({
      basedir: PUG_SRC
    }))
    .pipe(gulp.dest(PUG_DEST))
    .pipe(browserSync.stream());
});

/*------------------------------------------------------------
 SASSのコンパイル
 --gulp-sassを使用しSassのコンパイルを行う。
 --ベンダープレフィックスの指定を上記設定にて行う。
------------------------------------------------------------*/
gulp.task('sass', () => {
  gulp.src(SASS_SRC)
      .pipe(plumber({ // gulp-pluberを入れることで、エラー時にgulpが停止するのを阻止
          errorHandler: notify.onError('Error: <%= error.message %>') // gulp-notifyでエラーの通知
      }))
      .pipe(sass({outputStyle: "compressed"})) // コメント排除
      .pipe(autoprefixer(AUTOPREFIXER_OPTIONS)) // gulp-aotoprefixerでベンダープレフィックスを付与
      .pipe(mergeMediaQueries()) // メディアクエリーの順番を整頓
      .pipe(csslint()) // 構文チェック
      .pipe(csscomb()) // gulp-csscombでcssを整形
      .pipe(minifyCss({ keepSpecialComments: 1, processImport: false })) // minifyをする
      .pipe(gulp.dest(SASS_DEST))
      .pipe(browserSync.stream());
});

/*------------------------------------------------------------
 JavaScriptのトランスパイル
 --Babelとwebpackを使用する。
 --設定はwebpack.config.jsで行う。
------------------------------------------------------------*/
gulp.task('babel', () => {
    return gulp.src([JS_SRC])
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(JS_DEST))
        .pipe(browserSync.stream());
});

/*------------------------------------------------------------
 コピー
 --ライブラリ等をコピーする
------------------------------------------------------------*/
gulp.task('copy', () => {
  gulp.src(JS_ENDOR_SRC).pipe(gulp.dest(JS_ENDOR_DEST));
  gulp.src('./src/data/**/*').pipe(gulp.dest('./dest/'+PROJECT_NAME+'/assets/data/'));
  return
});

/*------------------------------------------------------------
 イメージ圧縮
 --イメージ画像を圧縮する。
------------------------------------------------------------*/
gulp.task('imgmin', () => {
  gulp.src(IMG_SRC)
      .pipe(imagemin(
        [
          pngquant({
            quality: '95',
            speed: 1,
            floyd:0
          }),
          mozjpeg({
            quality: 85,
            progressive: true
          }),
          imagemin.svgo(),
          imagemin.optipng(),
          imagemin.gifsicle()
        ]
      ))
      .pipe(gulp.dest(IMG_DEST))
});

/*------------------------------------------------------------
 アイコンフォント生成
 --svgからアイコンフォントを生成する。
------------------------------------------------------------*/
gulp.task('iconfont', () => {
  var svgminData;
  svgminData = gulp.src(ICON_SRC + '*.svg').pipe(svgmin());
  return svgminData.pipe(plumber()).pipe(iconfontCss({
    fontName: 'iconfont',
    path: ICON_SRC + '_icons.scss',
    targetPath: '../sass/object/project/_icons.scss',
    fontPath: '/assets/fonts/'
  })).pipe(iconfont({
    fontName: 'iconfont',
    formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],
    appendCodepoints: false
  })).pipe(gulp.dest(FONTS_SRC)).on('end', () => {
    return gulp.src(FONTS_SRC + '**/*').pipe(gulp.dest(FONTS_DEST));
  });
});

/*------------------------------------------------------------
 ファイル削除
 -- 指定されたディレクトリ/ファイル削除する
------------------------------------------------------------*/
// DEST配下
gulp.task('del', function(cb) {
  return rimraf('dest/', cb);
});

/*------------------------------------------------------------
 ローカルサーバ起動
 --ExpressServerを起動する。
 --サーバの設定はserver.jsで設定する。
------------------------------------------------------------*/
gulp.task('serverStart', () => {
    gulp.src(SERVER_START_PATH) .pipe(exec('node server.js'));
});

/*------------------------------------------------------------
 オートリロード
 --Destに変更があった場合に、ブラウザをリロードし再表示する。
 --IS_AUTO_RELOADでリロード実施のON/OFFを切替える。
------------------------------------------------------------*/
gulp.task('browserSync', () => {
  browserSync.init({
    browser: BROWSER_AT_DEVELOP,
    server: {
      baseDir: SERVER_START_PATH
    },
    notify: false,
    ghostMode: false
  });
});

/*------------------------------------------------------------
 ファイル監視
------------------------------------------------------------*/
gulp.task('watch', () => {
  watch([SASS_SRC], event => {
    gulp.start(['sass']);
  });

  watch([JS_SRC], event => {
    gulp.start(['babel']);
  });

  watch([PUG_SRC], event => {
    gulp.start(['pug']);
  });

  watch([IMG_SRC], event => {
    gulp.start(['imgmin']);
  });

  watch([ICON_SRC], event => {
    gulp.start(['iconfont']);
  });
});

/*------------------------------------------------------------
 gulpコマンド
 --defaultコマンドに監視を設定する。
 --ただしオートリロードON/OFFのにより、起動する処理を変更する。
 --ON:オートリロード, OFF:Expressによるローカルサーバ
------------------------------------------------------------*/
gulp.task('default', callback => {
  if(IS_AUTO_RELOAD) {
    // AutoReloadVersion
    return runSequence(
      'del',
      ['pug', 'sass', 'babel', 'imgmin', 'copy', 'iconfont'],
      'browserSync',
      'watch',
      callback
    );
  } else {
    // ExpressVersion
    return runSequence(
      'del',
      ['pug', 'sass', 'babel', 'imgmin', 'copy', 'iconfont'],
      'serverStart',
      'watch',
      callback
   );
  }
});
