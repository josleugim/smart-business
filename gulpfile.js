/**
 * Created by Mordekaiser on 03/06/16.
 */
var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    gulpMocha = require('gulp-mocha'),
    gutil = require('gulp-util');

gulp.task('default', function () {
    nodemon({
        script: 'app.js',
        ext: 'js',
        env: {
            PORT: 5000
        },
        ignore: ['./node_modules/**']
    })
        .on('restart', function () {
            console.log('restarting node server...');
        })
});

gulp.task('mocha', function () {
    return gulp.src('tests/*.js', {read: false})
        .pipe(gulpMocha({reporter: 'list'}))
        .on('error', gutil.log);
});

gulp.task('watch-mocha', function () {
    gulp.run('mocha');
    gulp.watch(['./**/*.js', 'test/**/*.js'], ['mocha']);
})