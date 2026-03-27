const express = require('express');
const ventaMiddleware = require('../middleware/ventaMiddleware')
const router = express.Router();

const {traerVentas,traerUnaVenta,subirVenta} = require("../controllers/ventaController");

/* treaer todos los tickets y todos sus productos */
router.get('/', traerVentas);

/* traer un ticket y todos sus productos */
router.get('/:id', traerUnaVenta);

/* subir el ticket y el id+cantidad de sus productos */
router.post('/', ventaMiddleware, subirVenta);

module.exports=router;