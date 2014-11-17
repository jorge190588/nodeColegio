var bd = require('./bd.js');
var sql;
var cnn;

exports.periodos = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
	cnn=req.getConnection;

	sql=" SELECT codigo,nombre FROM periodo WHERE empresa="+req.query.empresacodigo+" AND habilitado=1";
	console.log(sql);
	bd.consulta(cnn,sql,function(resultado){
		console.log(resultado);	
		res.type('application/json');
		res.send(resultado);
	});	
	
};
