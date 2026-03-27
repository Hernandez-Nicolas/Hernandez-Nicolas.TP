const expresss = require("express");
const {
    traerProductos,
    traerUnProducto,
    subirProducto,
    modificarProducto
} = require('../controllers/productoControllers');
const upload = require("../controllers/imgMulter");
const productoMiddleware = require('../middleware/productoMiddleware')

const router = expresss.Router();

/* Del usuario--solo trae datos */
/* trae todos los productos */
router.get('/', traerProductos);

/* trae un solo producto */
router.get('/:id', traerUnProducto);


/* Del administrador--renderizan un ejs */
/* sube un producto a la base */
router.post('/', upload.single('imagen'), productoMiddleware, subirProducto);

/* Actualiza un producto en la base */
router.put('/:id', upload.single('imagen'), productoMiddleware, modificarProducto);

module.exports = router;