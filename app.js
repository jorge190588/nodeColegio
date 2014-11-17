var express = require('express');
var http = require('http');
var path = require('path');
var connection  = require('express-myconnection'); 
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var bd = require('./routes/bd.js');
//Rutas de acceso a archivos del modelo de datos.

var modelo = require('./routes/modelo');
var correo = require('./routes/correo');
var routes = require('./routes');
var usuario = require('./routes/usuario');
var listados = require('./routes/listados');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(    
    connection(mysql,{
        host: '104.131.113.125',
        user: 'root',
        password : 'dsisistemas',
        port : 3306, //port mysql
        database:'bdcl'
    },'request')
);//route index, hello world

//Asignacion de listas

app.use('/', routes);
//app.use('/correo', correo);
app.use('/correo',correo);

app.use('/usuario/menu',usuario.menu);
app.use('/usuario/agregar',usuario.agregar);
app.use('/usuario/editar',usuario.editar);
app.use('/usuario/registro',usuario.registro);
app.use('/usuario/paginaPermiso',usuario.paginaPermiso);

app.use('/modelo/guardar_notas',modelo.guardar_notas);
app.use('/modelo/guardar_alertas',modelo.guardar_alertas);
app.use('/modelo/lista_alumnos',modelo.lista_alumnos);
app.use('/modelo/lista_notas',modelo.lista_notas);
app.use('/modelo/lista_notas_alumnos',modelo.lista_notas_alumnos);
app.use('/modelo/lista_alertas_alumnos',modelo.lista_alertas_alumnos);
app.use('/modelo/lista_alertas',modelo.lista_alertas);
app.use('/listados/periodos',listados.periodos);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handlerdsigt.com/movil
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
