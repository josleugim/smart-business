/**
 * Created by Mordekaiser on 03/06/16.
 */
var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');

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