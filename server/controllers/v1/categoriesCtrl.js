"use strict";

var mongoose = require('mongoose'),
    Category = mongoose.model('Category'),
    jwtValidation = require('../../services/jwtValidation'),
    getSlug = require('speakingurl');

exports.get = function(req, res) {
	console.log('Category GET');

	Category.find()
		.sort({name: 1})
		.exec(function (err, categories) {
			if(err) {
				res.status(500).json({success: false});
				res.end();
			}

			var objectCategory = [];

			categories.forEach(function(values) {
				var category = values.toObject();
				delete category.__v;
				delete category.createdAt;
				delete category.updatedAt;
				objectCategory.push(category);
			})

			res.status(200).json(objectCategory);
			res.end();
		})
}    

exports.post = function(req, res) {
	console.log('Category POST');
	var data = {};

	if(req.body.name) {
		data.name = req.body.name;
		data.slug = getSlug(req.body.name, {lang: 'es'});
	}
	if(req.body.description)
		data.description = req.body.description

	var category = new Category(data);
	category.save(function(err, doc) {
		if(err) {
			console.log(err);
			res.status(500).json({success:false});
			res.end();
		} else {
			res.status(201).json({success: true});
        	res.end();
		}
	});
};