var mongoose = require('mongoose'),
    Brand = mongoose.model('Brand'),
    jwtValidation = require('../../services/jwtValidation'),
    getSlug = require('speakingurl');

exports.post = function(req, res) {
	console.log('Brand POST');
	var data = {};

	if(req.body.name) {
		data.name = req.body.name;
		data.slug = getSlug(req.body.name, {lang: 'es'});
	}

	var brand = new Brand(data);
	brand.save(function(err, doc) {
		if(err) {
			res.status(500).json({success:false});
			res.end();
		} else {
			res.status(201).json({success: true});
        	res.end();
		}
	});
};

exports.put = function(req, res) {
	console.log('Brand PUT');

    var data = {};
    var query = {
        _id: req.query._id
    };

    if(req.body.name)
        data.name = req.body.name;

    Brand.update(query, {$set: data}, function (err) {
        if (err) {
            console.log(err);
            res.status(401).json({success: false, error: err});
        } else {
            res.status(201).json({success: true});
            res.end();
        }
    });
};

exports.get = function(req, res) {
	console.log('GET Brands');
    var query = {
        _id: req.query._id,
        isActive: true
    };

    if(req.query._id) {
        console.log('Brand GET by _id');
        Brand.findOne(query, function(err, doc) {
            if(doc) {
                delete doc.__v;
                delete doc.createdAt;
                delete doc.updatedAt;

                res.status(200).json(doc);
                res.end();
            }
        });
    } else {
        console.log('Brand GET');
        Brand.find({isActive: true})
            .sort({name: 1})
            .exec(function (err, brands) {
                if(err) {
                    res.status(500).json({success: false});
                    res.end();
                }

                var objectBrand = [];

                brands.forEach(function(values) {
                    var brand = values.toObject();
                    delete brand.__v;
                    delete brand.createdAt;
                    delete brand.updatedAt;
                    objectBrand.push(brand);
                });

                res.status(200).json(objectBrand);
                res.end();
            });
    }
};

exports.del = function(req, res) {
	console.log('Brand DELETE');

    var data = {
        isActive: false
    };

    var query = {
        _id: req.query._id
    };

    Brand.update(query, {$set: data}, function (err) {
        if (err) {
            console.log(err);
            res.status(401).json({success: false, error: err});
        } else {
            res.status(201).json({success: true});
            res.end();
        }
    });

};

exports.that = function(req, res) {
    var query = {};
    var data = {
        delegacion: 'delegacion',
        disciplina: 'disc',
        periodo: 'periodo',
        nivel: 1,
        anio: 2017
    };

    data.notas = {
        '584878b97d60ab072930fba9':
            {
                '58ae61d38f89a5574c28bdd4': 8.5
            },
        '57e4393fcc6f162d3166925e': {
            '58a71819fc82f69b0e1cf70b': 10,
            '58ae61d38f89a5574c28bdd4': 7.5
        }
    };

    query.delegacion = data.delegacion;
    query.disciplina = data.disciplina;
    query.periodo    = data.periodo;
    query.nivel      = data.nivel;
    query.anio       = data.anio;


    for (var alumno in data.notas) {
        var id_alumno = alumno;
        for (var materia in data.notas[alumno]) {
            var id_materia = materia;
            var nro_nota   = data.notas[alumno][materia];

            query.alumno = id_alumno;
            query.materia = id_materia;

            agregarNota(query, nro_nota, function (success) {

            })
        }
    }

    function agregarNota(query, nro_nota, callback) {
        Nota.find(query)
            .exec(function(err, result) {
                if (err) res.send(err);
                if (result.data) {
                    result.nota = nro_nota;
                    result.save(function(err, doc) { });
                } else {
                    var notas = new Nota();
                    notas.delegacion = data.delegacion;
                    notas.disciplina = data.disciplina;
                    notas.periodo  = data.periodo;
                    notas.nivel    = data.nivel;
                    notas.anio     = data.anio;
                    notas.alumno   = id_alumno;
                    notas.materia  = id_materia;
                    notas.fecha    = req.body.fecha;
                    notas.nota     = nro_nota;
                    notas.recupera = false;

                    notas.save(function(err, doc) { });
                }
            });
    }
};