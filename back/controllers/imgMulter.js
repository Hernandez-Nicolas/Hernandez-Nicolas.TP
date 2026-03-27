const multer = require('multer');
const path = require('path');

/* Defino el destino de guardado de las imagenes y de su nombre de archivo */
const storage = multer.diskStorage({
  destination: path.join(__dirname,'../public/images'),
  filename: (req,file,cb)=>{
    cb(null,Date.now()+'-'+file.originalname);
  }
});

const upload = multer({storage: storage, fileFilter: (req,file,cb)=>{
  const tiposPermitidos = ['image/jpeg','image/jpg','image/png'];
  if(tiposPermitidos.includes(file.mimetype)){
    cb(null,true);
  }
  else{
    cb(new Error('Tipo de archivo incorrecto'));
  }
}});

module.exports = upload;