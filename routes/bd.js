var mysql = require('mysql');

module.exports={
	consulta : function(connection,consulta,funcionRetorno){
	
	connection(function(err,cnx){
	 	if (err){
	 		console.log('Error en conexion.!!!');
	 		return '';
	 	}else{
			console.log('Conectado...');
			cnx.query(consulta,function(err,rows){

				if (err){
					funcionRetorno('',false);
				}
				funcionRetorno(rows,false);
			});
	 	}

	 });
	return;
	
	},
	configuracion :
	{
		host: '104.131.113.125',
        user: 'root',
        password : 'dsisistemas',
        port : 3306, //port mysql
        database:'bdcl'
	}
}

