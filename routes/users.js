var express = require('express');
var router = express.Router();
//var conf = require('../bin/cnn.js');
var mysql = require('mysql');

/* GET users listing. */
router.get('/', function(req, res) {
	res.send('Respuesta correcta');
	/*console.log('fn1 :'+conf.fnConcatenar('uno ',' dos'));
	console.log('fnConectar :');
	conf.fnConectar(function(response){
		console.log('Entro :'+response);
	});*/

});

module.exports = router;
