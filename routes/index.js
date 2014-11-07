var express = require('express');
var router = express.Router();

/* Leer la pagina principal */
router.get('/', function(req, res) {
  //res.render('index', { title: 'Express ejemplo' });
  	res.type('application/json');
	res.send('Services Run...');
});


module.exports = router;
