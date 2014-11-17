var mysql = require('mysql');

module.exports={
	consulta : function(connection,consulta,funcionRetorno){
	
	connection(function(err,cnx){
	 	if (err){
	 		console.log('Error en conexion.!!!');
	 		return '';
	 	}else{
			console.log('Conectado...');
			cnx.query(consulta,function(err,result){
				//console.log('bd largo:'+ result.affectedRows);
				if (err){
					funcionRetorno('',false);
				}
				
				if (result==undefined){
					funcionRetorno('',false);	
					console.log('sql sin datos');
				}else{
					console.log('sql con datos');
					funcionRetorno(result,false);
				}
				
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

