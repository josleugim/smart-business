/**
 * Created by Mordekaiser on 03/06/16.
 */
var express = require('express'),
    bodyParser = require('body-parser'),
    stylus = require('stylus'),
    nib = require('nib');

module.exports = function (app, config) {
    function compile(str, path) {
        return stylus(str)
            .set('filename', path)
            .use(nib())
    }
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(stylus.middleware({
        src: config.rootPath + '/public',
        compile: compile
    }));
    app.use(express.static(config.rootPath + '/public'));
};