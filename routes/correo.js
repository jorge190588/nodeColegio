/* Declaracion de modulos. */
var express = require('express');
var nodemailer = require('nodemailer');
var bd = require('./bd.js');
var router = express.Router();

//variables.
var transporter;
var sql;

//Precarga de Notas.
router.get('/porempresa',function(req,res){
	//consultar valores de la empresa.
	//http://localhost:3100/usuario/registro/?usuario=jorge&clave=jorge
	 res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    
	sql="SELECT correo,correoClave clave,correoProveedor proveedor,correoPuerto puerto FROM empresa WHERE codigo="+req.query.empresacodigo;
	bd.consulta(req.getConnection,sql,function(resultado){
		//res.header("Access-Control-Allow-Origin", "*");
    	//res.header("Access-Control-Allow-Headers", "X-Requested-With");
    	
    	if (resultado.length==1){
			//Enviar correo
			fnEnviarCorreo(resultado[0].proveedor,resultado[0].puerto,resultado[0].correo,resultado[0].clave,req.query.mail,req.query.asunto,req.query.contenido,function(resultado){
				res.type('application/json');
				res.send(''+resultado);	
			});	
    	}else{
    		res.type('application/json');
			res.send('Datos de empresa no encontrados');	
    	}
		
	});	

	
});

//Enviar cualquier correo de cualquier origen.
router.get('/', function(req, res) {
	console.log('entro en correo');
	//http://localhost:3100/correo/?mail=netneill@hotmail.com&asunto=demo&contenido=contenido&proveedor=gmail&mailFrom=netneillip@gmail.com&mailFromClave=zeta1919
	fnEnviarCorreo(req.query.proveedor,req.query.puerto,req.query.mailFrom,req.query.mailFromClave,req.query.mail,req.query.asunto,req.query.contenido,function(resultado){
		res.type('application/json');
		res.send(''+resultado);	
	});	
});

router.get('/enviar', function(req, res) {
//http://localhost:3100/correo/?mail=netneill@hotmail.com&asunto=demo&contenido=contenido&proveedor=gmail&mailFrom=netneillip@gmail.com&mailFromClave=zeta1919
	fnEnviarCorreo(req.query.proveedor,req.query.puerto,req.query.mailFrom,req.query.mailFromClave,req.query.mail,req.query.asunto,req.query.contenido,function(resultado){
		res.type('application/json');
		res.send(''+resultado);	
	});	
});

function fnEnviarCorreo(proveedor,puerto,mailFrom,mailFromClave,mail,asunto,contenido,funcionRetorno){

	//1. Consultar Empresas.
	if (proveedor=="gmail"){
		transporter = nodemailer.createTransport({
			service : 'gmail',
			auth : {
		        	user: mailFrom,
		        	pass: mailFromClave
			}
		});
	}else if(proveedor="godaddy"){
		transporter = nodemailer.createTransport({
			host : 'smtpout.secureserver.net',
			port : puerto, // 3535
			auth : {
		        	user: mailFrom,
		        	pass: mailFromClave
			}
		});
	}
	
	console.log('correo: '+mailFrom+" clave: "+mailFromClave);
	//reu2009
	transporter.sendMail({
	    from: mailFrom, //desde
	    to:  mail, 
	    subject:  asunto,
	    text:  contenido
	},function(error, respuesta){
		if (error){
			//return error;
			funcionRetorno(error);
			//res.render('correo', { title: 'No enviado '+error});	
		}else{
			//return 1;
			funcionRetorno(1);
			//res.render('correo', { title: 'Enviado'});	
		}
		
	});
	
}

module.exports = router;
