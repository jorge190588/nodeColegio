//6013
var bd = require('./bd.js');
var sql;
var cnn;

exports.ver = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

	//http://localhost:3100/usuario/registro/?usuario=jorge&clave=jorge
	cnn=req.getConnection;
	
	sql="select nombre,IFNULL(correo,'') correo,IFNULL(telefono,'') telefono from catedratico where codigo="+req.query.codigo;


	bd.consulta(cnn,sql,function(resultado){
		//si registro es valido guardar fecha ultimo acceso 

		if (resultado.length==1){
			res.type('application/json');
			res.send(JSON.stringify(resultado));	
			
			
		}else{
				res.type('application/json');
				res.send(JSON.stringify({nombre: 0, correo: ""}));	
		}
	});	
	
};