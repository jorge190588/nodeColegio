var mysql = require('mysql');
var bd = require('./bd.js');
var express = require('express');
var sql,sqlbase;
var cnn;


exports.lista= function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

	sql=" SELECT codigo,carnet,nombre,telefono,correo,observacion FROM persona WHERE empresa="+req.query.empresacodigo;
    
    bd.consulta(req.getConnection,sql,function(result){
	    res.type('application/json');
	    res.send(JSON.stringify(result));
	}); // fin de consultar columnas.

}