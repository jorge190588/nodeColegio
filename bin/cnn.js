var mysql = require('mysql');

var connection = mysql.createConnection({
	host: '104.131.113.125',
    user: 'root',
    password : 'dsisistemas',
    port : 3306, //port mysql
    database:'bdcl'
});

exports.conexion = function(req,res){
	var respuesta= 2;
	connection.connect(function(error){
   		if(error)
   		{
   			console.log('conexion InCorrecta');
      		respuesta=0;
   		}else{
      		console.log('Conexion correcta.');
      		respuesta=1;
   		}
	});
	//finalizar la conexion.
	connection.end();

	return respuesta;
};


/*
var mysql = require('mysql');

var conexion = mysql.createConnection({
   host: '104.131.113.125',
   user: 'root',
   password: 'dsisistemas',
   database: 'bdcl',
   port: 3306
});

 //modulo de variables globales de configuracion
module.exports = {
  fnConcatenar: function (a,b) {http://192.168.1.30
    return a+' '+b;
  },
  fnConectar: function () {
	//realizar conexion.
	conexion.connect(function(error){
	   if(error){
	      return 0;
	   }else{
	      return 1;
	   }
	});//fin de conexion
  },
  cnn: conexion
};
*/

//URL DEL MANUAL DE EJEMPLO PARA VARIABLES GLOBALES.
//http://stackoverflow.com/questions/5797852/in-node-js-how-do-i-include-functions-from-my-other-files