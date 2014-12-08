//6013
var bd = require('./bd.js');
var sql;
var cnn;

exports.registro = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

	//http://localhost:3100/usuario/registro/?usuario=jorge&clave=jorge
	cnn=req.getConnection;
	
	sql=" SELECT u.codigo,u.nombre usuario,e.nombre empresa,e.codigo empresacodigo,admin,  ";
	sql+=" CASE WHEN admin=0 THEN IFNULL((SELECT p.codigo FROM persona p WHERE p.codigo=u.persona),0) ";
	sql+=" ELSE IFNULL((SELECT p.codigo FROM catedratico p WHERE p.codigo=u.catedratico),0) END	 personacodigo,  ";
	sql+=" CASE WHEN admin=0 THEN IFNULL((SELECT p.nombre FROM persona p WHERE p.codigo=u.persona),'') ";
	sql+=" ELSE IFNULL((SELECT p.nombre FROM catedratico p WHERE p.codigo=u.catedratico),'') ";
	sql+=" END AS persona, ";
	sql+=" IFNULL((SELECT p.carnet FROM persona p WHERE p.codigo=u.persona),'') carnet,visitaFecha,visitaDispositivo, ";
	sql+= " (SELECT p.url FROM pagina p, paginaGrupo pg, usuario_paginaGrupo upg WHERE p.paginaGrupo=pg.codigo AND upg.paginaGrupo=pg.codigo AND upg.usuario=u.codigo ORDER BY pg.orden,p.orden LIMIT 1) paginaInicio "; 
	sql+=" FROM usuario u, empresa e ";
	sql+=" WHERE u.nombre='"+req.query.usuario+"' AND u.clave='"+req.query.clave+"'";


	bd.consulta(cnn,sql,function(resultado){
		//si registro es valido guardar fecha ultimo acceso 

		if (resultado.length==1){
			
			sql="UPDATE usuario SET visitaFecha= NOW(),visitaDispositivo='"+req.query.dispositivo+"' where codigo="+resultado[0].codigo;
			bd.consulta(cnn,sql,function(result){
				res.type('application/json');
				res.send(JSON.stringify(resultado));	
			});	
			
		}else{
				res.type('application/json');
				res.send(JSON.stringify({codigo: 0, error: "Usuario / Clave incorrecto"}));	
		}
	});	
	
};

exports.paginaPermiso=function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    
    sql="SELECT COUNT(p.url) contador FROM usuario_paginaGrupo upg, paginaGrupo pg,pagina p ";
	sql+=" WHERE upg.paginaGrupo=pg.codigo AND p.paginaGrupo=pg.codigo AND upg.usuario="+req.query.usuario;
	sql+=" AND p.url='"+req.query.pagina+"' order by pg.orden,p.orden";

	bd.consulta(req.getConnection,sql,function(resultado){
		res.type('application/json');
		res.send(resultado);
	});	

	//33jl0014
}// fin de paginaPermiso

exports.menu=function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

	cnn=req.getConnection;
	
	sql=" SELECT pg.nombre grupo,p.nombre pagina, p.url FROM usuario_paginaGrupo upg, paginaGrupo pg,pagina p "
	sql+=" WHERE upg.paginaGrupo=pg.codigo AND p.paginaGrupo=pg.codigo AND upg.usuario="+req.query.usuario+" order by pg.orden,p.orden";
	
	bd.consulta(cnn,sql,function(resultado){
		res.type('application/json');
		res.send(resultado);
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
