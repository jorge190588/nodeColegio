var bd = require('./bd.js');
var sql;
var cnn;

exports.registro = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

	//http://localhost:3100/usuario/registro/?usuario=jorge&clave=jorge
	cnn=req.getConnection;

	
	sql="SELECT u.codigo,u.nombre usuario,e.nombre empresa,e.codigo empresacodigo,admin, "
	sql+=" IFNULL((SELECT p.codigo FROM persona p WHERE p.codigo=u.persona),0) personacodigo, "
	sql+=" IFNULL((SELECT p.nombre FROM persona p WHERE p.codigo=u.persona),'') persona, "
	sql+=" IFNULL((SELECT p.carnet FROM persona p WHERE p.codigo=u.persona),'') carnet "
	sql+=" FROM usuario u, empresa e "
	sql+=" WHERE u.nombre='"+req.query.usuario+"' AND u.clave='"+req.query.clave+"'";

	bd.consulta(cnn,sql,function(resultado){
		res.send(resultado);
		console.log(resultado);
	});	
	
};

exports.agregar=function(req,res){
	res.type('application/json');
	res.send('Funcion agregar...'+bd.cnn);	
	console.log('Agregar'+bd.cnn);
};

exports.editar=function(req,res){
	res.send('Funcion de Editar');	
	console.log('Editar');
};
