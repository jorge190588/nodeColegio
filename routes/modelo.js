var mysql = require('mysql');
var bd = require('./bd.js');
var express = require('express');
var sql,sqlbase;
var cnn;

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

	sql=" SELECT c.nombre FROM datos d, datosDetalle de, curso c, persona p ";
	sql+=" WHERE d.codigo= de.datos AND c.codigo=de.curso AND p.carnet=d.carnet ";
	sql+=" AND fecha BETWEEN '"+req.query.fechainicio+" 00:00' AND '"+req.query.fechafin+" 00:00'";
	sql+=" AND d.usuario="+req.query.usuariocodigo+" AND d.empresa="+req.query.empresacodigo;
	sql+=" group by c.nombre ";
	
   
	bd.consulta(req.getConnection,sql,function(columnas){
	    var base = new Array();
	    	    
    	base.push(new exports.dato('codigo',''));
    	base.push(new exports.dato('fecha',''));
	    base.push(new exports.dato('carnet',''));
	    base.push(new exports.dato('nombre',''));	
	    
	    
	    console.log(columnas);
		//recorrer el array
		columnas.forEach(function(val,index){
			base.push(new exports.dato(val.nombre,''));
		});
		
	
		sql=" SELECT d.codigo,DATE_FORMAT(d.fecha, '%d-%m-%y %h:%i') fecha,p.carnet,p.nombre,c.nombre curso,de.valor FROM datos d, datosDetalle de, curso c, persona p ";
		sql+=" WHERE d.codigo= de.datos AND c.codigo=de.curso AND p.carnet=d.carnet ";
		sql+=" AND fecha BETWEEN '"+req.query.fechainicio+" 00:00' AND '"+req.query.fechafin+" 00:00'";
		sql+=" AND d.usuario="+req.query.usuariocodigo+" AND d.empresa="+req.query.empresacodigo;
	
		var codAnt=0;
		var contador=0;

		bd.consulta(req.getConnection,sql,function(resultado){
			var listaFinal=[];
			var filaNueva;
			if (resultado.length==0){
				res.type('application/json');
				res.send(resultado);
				console.log('Sin resultados '+resultado.length);
			}

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
					console.log('Final lista notas');
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


exports.lista_notas_movil= function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    sql=" SELECT c.nombrecompleto curso,DATE_FORMAT(d.fecha, '%d-%m-%y') fecha,'Nota Final' tipo,de.valor nota "
	sql+=" FROM datos d, datosDetalle de, curso c, persona p, periodo pr "
	sql+=" WHERE d.codigo= de.datos AND c.codigo=de.curso AND p.carnet=d.carnet AND d.periodo=pr.codigo "
	sql+=" AND d.periodo='"+req.query.periodocodigo+"' AND d.carnet='"+req.query.carnet+"' AND d.empresa='"+req.query.empresacodigo+"' AND pr.ano="+req.query.ano;

	bd.consulta(req.getConnection,sql,function(result){
		res.type('application/json');
		res.send(JSON.stringify(result));
	}); // fin de consultar columnas.
} // fin de lista notas alumnos		


//Pagina web lista de alumnos, para usuarios alumnos.
exports.lista_notas_alumnos= function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    console.log('Año '+req.query.ano);
	sql=" SELECT c.nombre FROM datos d, datosDetalle de, curso c, persona p,periodo pr ";
	sql+=" WHERE d.codigo= de.datos AND c.codigo=de.curso AND p.carnet=d.carnet and pr.codigo=d.periodo ";
	sql+=" AND d.periodo="+req.query.periodocodigo;
	sql+=" AND d.carnet='"+req.query.carnet+"' AND d.empresa="+req.query.empresacodigo+" and pr.ano="+req.query.ano;
	sql+=" group by c.nombre ";

	 
    
	bd.consulta(req.getConnection,sql,function(columnas){
	    var base = new Array();
	    base.push(new exports.dato('fecha',''));
	    
	    console.log(columnas);
		//recorrer el array
		columnas.forEach(function(val,index){
			base.push(new exports.dato(val.nombre,''));
		});
		
		sql=" SELECT d.codigo,DATE_FORMAT(d.fecha, '%d-%m-%y %h:%i') fecha,p.carnet,p.nombre,c.nombre curso,de.valor FROM datos d, datosDetalle de, curso c, persona p";
		sql+=" WHERE d.codigo= de.datos AND c.codigo=de.curso AND p.carnet=d.carnet ";
		sql+=" AND d.periodo="+req.query.periodocodigo;
		sql+=" AND d.carnet='"+req.query.carnet+"' AND d.empresa="+req.query.empresacodigo;
						

		var codAnt=0;
		var contador=0;

		bd.consulta(req.getConnection,sql,function(resultado){
			var listaFinal=[];
			var filaNueva;
			if (resultado.length==0){
				res.type('application/json');
				res.send(resultado);
				console.log('Sin resultados '+resultado.length);
			}

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
			
					filaNueva[0].valor=val2.fecha;					
					
					if (contador>0){
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
					console.log('Final lista notas');
					res.type('application/json');
					res.send(listaFinal);
				}

			});//fin de for
			//console.log(lista);
			
		}); // fin de consulta registros
		
		
		//console.log(resultado);
			
	}); // fin de consultar columnas.
} // fin de lista notas alumnos

exports.lista_alertas= function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    //columnas
    var base = new Array();
    base.push(new exports.dato('Codigo',''));
    base.push(new exports.dato('Fecha',''));
    base.push(new exports.dato('Carnet',''));
    base.push(new exports.dato('Nombre',''));
    base.push(new exports.dato('Correo',''));
    base.push(new exports.dato('Telefono',''));
    base.push(new exports.dato('Descripcion',''));
		
		
	sql=" SELECT a.Codigo,DATE_FORMAT(a.Fecha, '%d-%m-%y %h:%i') Fecha,a.Carnet,p.Nombre,a.Correo,a.Telefono,a.Descripcion ";
	sql+=" FROM alertas a, persona p WHERE a.carnet=p.carnet ";
	sql+=" AND a.fecha BETWEEN '"+req.query.fechainicio+" 00:00' AND '"+req.query.fechafin+" 00:00'";
	sql+=" AND a.usuario="+req.query.usuariocodigo+" AND a.empresa="+req.query.empresacodigo;


	var codAnt=0;
	var contador=0;

	bd.consulta(req.getConnection,sql,function(resultado){
		var listaFinal=[];
		var filaNueva;
		if (resultado.length==0){
			res.type('application/json');
			res.send(resultado);
			console.log('Sin resultados '+resultado.length);
		}
		//recorrer el resultado.
		resultado.forEach(function(val2,index2){
			filaNueva =  new Array();
			//agregar los metodos
			base.forEach(function(val3,index3){
				filaNueva.push(new exports.dato(val3.code,''));
			});

			//asignar valor 
			filaNueva[0].valor=val2.Codigo; //codigo
			filaNueva[1].valor=val2.Fecha; //fecha 
			filaNueva[2].valor=val2.Carnet; //carnet
			filaNueva[3].valor=val2.Nombre; //nombre
			filaNueva[4].valor=val2.Correo; //correo
			filaNueva[5].valor=val2.Telefono; //telefono
			filaNueva[6].valor=val2.Descripcion; //descripcion

			listaFinal.push(filaNueva);

			if (resultado.length==index2+1){
				res.type('application/json');
				res.send(listaFinal);
			}

		});//fin de for
			
	}); // fin de consulta registros
			
	

}// fin funcion lista de alertas

exports.lista_alertas_alumnos= function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    //columnas
    var base = new Array();
    base.push(new exports.dato('Fecha',''));
    base.push(new exports.dato('Descripcion',''));
    base.push(new exports.dato('Correo',''));
    base.push(new exports.dato('Telefono',''));
		
	sql=" SELECT DATE_FORMAT(a.Fecha, '%d-%m-%y %h:%i') Fecha,a.Descripcion,a.Correo,a.Telefono ";
	sql+=" FROM alertas a, persona p,periodo pr WHERE a.carnet=p.carnet AND pr.codigo=a.periodo ";
	sql+=" AND a.carnet='"+req.query.carnet+"' AND a.empresa="+req.query.empresacodigo;
	sql+=" AND a.periodo="+req.query.periodocodigo+" and pr.ano="+req.query.ano;


	var codAnt=0;
	var contador=0;

	bd.consulta(req.getConnection,sql,function(resultado){
		
		var listaFinal=[];
		var filaNueva;		
				
		
		if (resultado.length==0){
			res.type('application/json');
			res.send(JSON.stringify(resultado));
		}else{
			//recorrer el resultado.
			resultado.forEach(function(val2,index2){
				filaNueva =  new Array();
				//agregar los metodos
				base.forEach(function(val3,index3){
					filaNueva.push(new exports.dato(val3.code,''));
				});

				//asignar valor 
				filaNueva[0].valor=val2.Fecha; //fecha 
				filaNueva[1].valor=val2.Descripcion; //descripcion
				filaNueva[2].valor=val2.Correo; //correo
				filaNueva[3].valor=val2.Telefono; //telefono
				

				listaFinal.push({'Fecha':val2.Fecha,'Descripcion': val2.Descripcion,'Correo': val2.Correo,'Telefono':val2.Telefono});

				if (resultado.length==index2+1){
					res.type('application/json');
					res.send(JSON.stringify(listaFinal));
					console.log(JSON.stringify(listaFinal));
				}
			});//fin de for		
		}
			
	}); // fin de consulta registros



}// fin funcion lista de alertas

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
	
	if(req.query.datos.length==0){
		res.type('application/json');
		res.send(JSON.stringify({estado:0 ,msj: 'No existen datos'}));
	}
	else
	{	

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
					var sql="insert into datos (empresa,correo,telefono,carnet,periodo,fecha,usuario) values('"+req.query.empresacodigo+"','"+correo+"','"+telefono+"','"+fila[1]+"','"+req.query.periodocodigo+"',CURRENT_TIMESTAMP(),'"+req.query.usuariocodigo+"');"
					connection.query(sql, function(err1, result1) {
						if(err1) { 
					    	connection.rollback(function() {
					    		res.type('application/json');				          				
		          				res.send(JSON.stringify({estado:0 ,msj:err1 }));
					        	throw err1;
					    	});
					    }

						var codigoDatos="";
						console.log('Resulta inserted id '+result1.insertId);

				      	//5. recorrer detalle de fila.
						var sql3="insert into datosDetalle (datos,curso,valor) values";
						fila.forEach(function (col,icol){
							if (icol>4){
								sql3+="('"+(result1.insertId)+"','"+filaTitulo[icol].replace("\n","")+"','"+col.replace("\n","")+"'),";	
							}
						});//fin de recorrer columnas.
						

						//reemplazar la coma por punto y coma.
						sql3=sql3.substring(0,sql3.length-1)+";";

						//6. Insertar detalle
						connection.query(sql3, function(err3, result3) {
					    	if (err3) { 
					        	connection.rollback(function() {
					        		res.type('application/json');				          				
				          			res.send(JSON.stringify({estado:0 ,msj:err3 }));
					          		throw err3;
					        	});
					      	}  

				      		connection.commit(function(err4) {
				        		if (err4) { 
				          			connection.rollback(function() {
										res.type('application/json');				          				
				          				res.send(JSON.stringify({estado:0 ,msj:err4 }));
				          				throw err4;
			    	      			});
			        			}
			        			console.log('Registro guardado');
			        			//res.type('application/json');
								//res.send('Registros guardados.-');	
			      			});// Fin de conmmit.
		      			}); // fin de insetar detalle.

					    //}); // fin de consultar codigo de datos.
					});// fin de insertar encabezado.
				}//fin de else en for recorrer filas.
			}); //fin del ciclo.
			//Mensajes de Exito
			res.type('application/json');
			res.send(JSON.stringify({estado:1 ,msj: 'Registros guardados'}));
		});// fin de transaccion.
	}//fin de verificar si existen datos
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
	
	if(req.query.datos.length==0){
		res.type('application/json');
		res.send(JSON.stringify({estado:0 ,msj: 'No existen datos'}));
	}
	else{	
	
		//1. inicio de la transaccion.
		connection.beginTransaction(function(err) {
			if (err) { 
				res.type('application/json');				          				
				res.send(JSON.stringify({estado:0 ,msj:err }));
				throw err; 
			}

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
					sql="insert into alertas (carnet,telefono,correo,descripcion, usuario,empresa,fecha,periodo) values('"+fila[1]+"','"+telefono+"','"+correo+"','"+fila[5]+"','"+req.query.usuariocodigo+"','"+req.query.empresacodigo+"',CURRENT_TIMESTAMP(),"+req.query.periodocodigo+");"
					connection.query(sql, function(err1, result1) {
						if(err1) { 
					    	connection.rollback(function() {
					    		res.type('application/json');				          				
				          		res.send(JSON.stringify({estado:0 ,msj:err1 }));
					        	throw err1;
					    	});
					    }
						
			      		connection.commit(function(err4) {
			        		if (err4) { 
			          			connection.rollback(function() {
			          				res.type('application/json');				          				
				          			res.send(JSON.stringify({estado:0 ,msj:err4 }));
			          				throw err4;
		    	      			});
		        			}
		        			console.log('Registro guardado');
		      			});// Fin de conmmit.
					});// fin de insertar encabezado.
				}//fin de else en for recorrer filas.
			}); //fin del ciclo.
			//Mensajes de Exito
			res.type('application/json');				          				
			res.send(JSON.stringify({estado:1 ,msj:'Registros guardados'}));
		});// fin de transaccion.
	}//fin de si hay datos.

}; // 0. fin de la funcion PRINCIPAL.
 



exports.combo = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
  
	sql=" SELECT "+req.query.codigo+" codigo,"+req.query.nombre+" nombre from "+req.query.tabla+" "+req.query.condicion;
	
	bd.consulta(req.getConnection,sql,function(resultado){
		res.send(JSON.stringify(resultado));
	});	

}// fin de lista 
