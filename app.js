/* Require por defecto del proyecto creado con express */
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

/* Require de express y cors */
const express = require('express');
const cors = require("cors");

/* Require de las rutas */
const indexRouter = require('./routes/index');
const dashBoardRouter = require('./routes/dashBoard');
const productoRouter = require('./routes/producto');
const imagenRouter = require('./routes/imagen');

const app = express();/* Creo una instancia de express */
app.use(cors());/* Habilito cors */
app.use(express.json());/* Permito leer en formato JSON */

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/dashboard', dashBoardRouter);
app.use('/producto', productoRouter);
app.use('/imagen', imagenRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


const db = require("./data/db");
const conexionDB = async () => {
  try{
    await db.authenticate();
    console.log("conectado")
  }catch(err){
    console.log(err);
  }
};
conexionDB();
module.exports = app;
