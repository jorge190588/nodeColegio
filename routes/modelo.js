var mysql = require('mysql');
var bd = require('./bd.js');
var express = require('express');
var sql,sqlbase;
var cnn;

exports.convertObject = function (obj){
		for(var i in obj){
			if(Object.prototype.toString.call(obj[i]) === "[object Object]"){
				for(var j in obj[i]){
					if(tipoElemento(obj[i][j]) === "[object Object]")
					{
						for(var k in obj[i][j])
						{
							obj[i][j] = obj[i][j][k];
						}
					}
					obj[i][j] = obj[i][j];
				}
			}
		}
		return obj;
	}

exports.array_buscarid = function(filaNueva,searchFor, property) {
	var retVal = -1;
    var self = filaNueva;
    for(var index=0; index < self.length; index++){
        var item = self[index];
        if (item.hasOwnProperty(property)) {
            if (item[property].toLowerCase() === searchFor.toLowerCase()) {
                retVal = index;
                return retVal;
            }
        }
    };
    return retVal;
};

exports.array_limpiar = function(searchFor, property) {
	console.log('entro en array_limpiar' );
    var retVal = -1;
    var self = this;
    for(var index=0; index < self.length; index++){
        var item = self[index];
        console.log(item.valor);
        item.valor="";
    };
    //return retVal;
};

exports.dato = function(code,valor){
	this.code=code;
	this.valor=valor;
}


exports.lista_notas= function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    //Establecer columnas
    sql=" SELECT c.nombre FROM datos d, datosDetalle de, curso c, persona p ";
	sql+=" WHERE d.codigo= de.datos AND c.codigo=de.curso AND p.carnet=d.carnet ";
	sql+=" AND fecha BETWEEN '"+req.query.fechainicio+" 00:00' AND '"+req.query.fechafin+" 00:00'";
	sql+=" AND d.usuario="+req.query.usuariocodigo+" AND d.empresa="+req.query.empresacodigo;
	sql+=" group by c.nombre "

	bd.consulta(req.getConnection,sql,function(columnas){
	    var base = new Array();
	    base.push(new exports.dato('codigo','0'));
	    base.push(new exports.dato('fecha',''));
	    base.push(new exports.dato('carnet',''));
	    base.push(new exports.dato('nombre',''));
	    
		//recorrer el array
		columnas.forEach(function(val,index){
			base.push(new exports.dato(val.nombre,''));
		});
		
		
		sql=" SELECT d.codigo,DATE_FORMAT(d.fecha, '%d-%m-%y %h:%i') fecha,p.carnet,p.nombre,c.nombre curso,de.valor FROM datos d, datosDetalle de, curso c, persona p ";
		sql+=" WHERE d.codigo= de.datos AND c.codigo=de.curso AND p.carnet=d.carnet ";
		sql+=" AND fecha BETWEEN '"+req.query.fechainicio+" 00:00' AND '"+req.query.fechafin+" 00:00'";
		sql+=" AND d.usuario="+req.query.usuariocodigo+" AND d.empresa="+req.query.empresacodigo;
		//sql+=" AND d.codigo=263";

		var codAnt=0;
		var contador=0;

		bd.consulta(req.getConnection,sql,function(resultado){
			var listaFinal=[];
			
			var filaNueva;
			//recorrer el resultado.
			resultado.forEach(function(val2,index2){
				
				if (codAnt!=val2.codigo){
					contador++;

					console.log('crear nueva fila '+val2.codigo);
					filaNueva =  new Array();
					//agregar los metodos
					base.forEach(function(val3,index3){
						filaNueva.push(new exports.dato(val3.code,''));
					});

					filaNueva[0].valor=val2.codigo;
					filaNueva[1].valor=val2.fecha;
					filaNueva[2].valor=val2.carnet;
					filaNueva[3].valor=val2.nombre;

					if (contador>0){
						console.log('insertar en lista final')
						listaFinal.push(filaNueva);
					}
					var ii = exports.array_buscarid(filaNueva,val2.curso, "code");
					filaNueva[ii].valor=val2.valor;
					
				}else{
					//asignar valor del arreglo
					var ii = exports.array_buscarid(filaNueva,val2.curso, "code");
					filaNueva[ii].valor=val2.valor;
				}

				codAnt=val2.codigo;

				if (resultado.length==index2+1){
					res.type('application/json');
					res.send(listaFinal);
				}

			});//fin de for
			//console.log(lista);
			
		}); // fin de consulta registros
		
		
		//console.log(resultado);
			
	}); // fin de consultar columnas.

	//res.send(base);
	
}

exports.lista_alumnos = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    //alumnos agrupado por alertas y 
	if (req.query.opcion==1){

		sql=" SELECT codigo,nombre FROM ( ";
		sql+= " SELECT a.carnet codigo, p.nombre FROM alertas a, persona p ";
		sql+= " WHERE a.carnet=p.carnet AND  a.usuario=1 AND a.empresa=1 ";
		sql+= " UNION ALL ";
		sql+= " SELECT d.carnet AS codigo,p.nombre FROM datos d, persona p ";
		sql+= " WHERE d.carnet=p.carnet AND d.usuario="+req.query.usuario+" AND d.empresa="+req.query.empresa;
		sql+= " )AS result ";
		sql+= " GROUP BY result.codigo,result.nombre ";
		
		bd.consulta(req.getConnection,sql,function(resultado){
			res.send(resultado);
			console.log(resultado);
		});	

	}

}// fin de lista 


exports.guardar_notas = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

	//encabezado
	var obj=[],telefono="",correo="",contador=0;
	
	var connection = mysql.createConnection({
		host: bd.configuracion.host,
	    user: bd.configuracion.user,
	    password : bd.configuracion.password,
	    port : bd.configuracion.port, //port mysql
	    database: bd.configuracion.database
	});
	

	//1. inicio de la transaccion.
	connection.beginTransaction(function(err) {
		if (err) { throw err; }

		var filaTitulo;
		//2. recorrer los datos.
		req.query.datos.forEach(function (fila,ifila){
	
			if (ifila==0){
				filaTitulo=fila;
			}else{
				//correo y telefono
				if (fila[3]=="0"){
					telefono="";
				}else{
					telefono=fila[3];
				}

				if (fila[4]=="0"){
					correo="";
				}else{
					correo=fila[4];
				}

				

				//3. insertar el encabezado.
				sql="insert into datos (empresa,correo,telefono,carnet,periodo,fecha,usuario) values('"+req.query.empresacodigo+"','"+correo+"','"+telefono+"','"+fila[1]+"','"+req.query.periodocodigo+"',CURRENT_TIMESTAMP(),'"+req.query.usuariocodigo+"');"
				connection.query(sql, function(err1, result1) {
					if(err1) { 
				    	connection.rollback(function() {
				    		console.log('err1: '+err1);
				        	throw err1;
				    	});
				    }

					var codigoDatos="";

				    //4. consultar codigo de datos.
				    sql="select max(codigo)+"+contador+" codigo from datos;";
				    contador+=1;
				    connection.query(sql, function(err2, result2) {
				    	if (err2) { 
				        	connection.rollback(function() {
				        		console.log('err2 '+err2);
				          		throw err2;
				        	});
				      	}  
						
				      	for(var key in result2) { 
				      		codigoDatos=parseInt(result2[key].codigo);
				      		console.log('Codigo Encabezado : '+parseInt(result2[key].codigo));
				      	}

				      	//5. recorrer detalle de fila.
						sql="insert into datosDetalle (datos,curso,valor) values";
						fila.forEach(function (col,icol){
							if (icol>4){
								sql+="('"+(codigoDatos-1)+"','"+filaTitulo[icol].replace("\n","")+"','"+col.replace("\n","")+"'),";	
							}
						});//fin de recorrer columnas.
		
						//reemplazar la coma por punto y coma.
						sql=sql.substring(0,sql.length-1)+";";

						//6. Insertar detalle
						connection.query(sql, function(err3, result3) {
					    	if (err3) { 
					        	connection.rollback(function() {
					        		console.log('err3: '+err3);
					          		throw err3;
					        	});
					      	}  

				      		connection.commit(function(err4) {
				        		if (err4) { 
				          			connection.rollback(function() {
				          				console.log('err4 '+err4);
				          				throw err4;
			    	      			});
			        			}
			        			console.log('Registro guardado');
			        			//res.type('application/json');
								//res.send('Registros guardados.-');	
			      			});// Fin de conmmit.
		      			}); // fin de insetar detalle.

				    }); // fin de consultar codigo de datos.
				});// fin de insertar encabezado.
			}//fin de else en for recorrer filas.
		}); //fin del ciclo.
		//Mensajes de Exito
		res.type('application/json');
		res.send('Registros guardados.-');

	});// fin de transaccion.

}; // 0. fin de la funcion PRINCIPAL.
 

exports.guardar_alertas = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    console.log(req.query.datos);

	//encabezado
	var obj=[],telefono="",correo="",contador=0;
	
	var connection = mysql.createConnection({
		host: bd.configuracion.host,
	    user: bd.configuracion.user,
	    password : bd.configuracion.password,
	    port : bd.configuracion.port, //port mysql
	    database: bd.configuracion.database
	});
	

	//1. inicio de la transaccion.
	connection.beginTransaction(function(err) {
		if (err) { throw err; }

		var filaTitulo;
		//2. recorrer los datos.
		req.query.datos.forEach(function (fila,ifila){
			
			if (ifila==0){
				filaTitulo=fila;
			}else{
				//correo y telefono
				if (fila[3]=="0"){
					telefono="";
				}else{
					telefono=fila[3];
				}

				if (fila[4]=="0"){
					correo="";
				}else{
					correo=fila[4];
				}

				
				//3. insertar el encabezado.
				sql="insert into alertas (carnet,telefono,correo,descripcion, usuario,empresa,fecha) values('"+fila[1]+"','"+telefono+"','"+correo+"','"+fila[5]+"','"+req.query.usuariocodigo+"','"+req.query.empresacodigo+"',CURRENT_TIMESTAMP());"
				connection.query(sql, function(err1, result1) {
					if(err1) { 
				    	connection.rollback(function() {
				    		console.log('err1: '+err1);
				        	throw err1;
				    	});
				    }
					
		      		connection.commit(function(err4) {
		        		if (err4) { 
		          			connection.rollback(function() {
		          				console.log('err4 '+err4);
		          				throw err4;
	    	      			});
	        			}
	        			console.log('Registro guardado');
	        			//res.type('application/json');
						//res.send('Registros guardados.-');	
	      			});// Fin de conmmit.
				});// fin de insertar encabezado.
			}//fin de else en for recorrer filas.
		}); //fin del ciclo.
		//Mensajes de Exito
		res.type('application/json');
		res.send('Registros guardados.-');

	});// fin de transaccion.


}; // 0. fin de la funcion PRINCIPAL.
 
