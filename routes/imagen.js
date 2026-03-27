const express = require('express');
const path = require("path");

const router = express.Router();

/* devuelve la ruta absoluta de la imagen y envia el archivo en el response */
router.get("/:img", (req,res)=>{
  res.sendFile(path.resolve('./public/images/'+req.params.img));
});

module.exports = router;