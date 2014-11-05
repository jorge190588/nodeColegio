var express = require('express');
var router = express.Router();

/* Leer la pagina principal */
router.get('/', function(req, res) {
  //res.render('index', { title: 'Express ejemplo' });
  	res.type('application/json');
	res.send('cadena'+cadenacnn);
});

router.get('/cnn', function(req, res) {
	res.type('application/json');
	res.send('cadena');
});

module.exports = router;
