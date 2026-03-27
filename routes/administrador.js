const express = require('express');
const administradorMiddleware = require('../middleware/administradorMiddleware')

const {iniciarSesion,registrarUsuario} = require('../controllers/administradorController');

const router = express.Router();

router.use(administradorMiddleware);
/* dar acceso al administrador */
router.post('/', iniciarSesion);

/* resgistra a un administrador */
router.post('/registrar', registrarUsuario);

module.exports=router;