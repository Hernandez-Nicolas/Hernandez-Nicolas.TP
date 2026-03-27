const administradorModel = require('../models/administradorModel');
const bcrypt = require('bcrypt');

const iniciarSesion = async (req,res)=>{
    try{
        const usuario = await administradorModel.findOne({where: {usuario: req.body.usuario}});
        if(usuario==null){
            res.json({message: 'Este usuario no existe'});
        }
        if(await bcrypt.compare(req.body.password,usuario.password)){
            res.render('dashBoard');
            /* res.json({message: 'El usuario existe y tiene contraseña correcta'}); */
        }
        else{
            res.json({message: 'Contraseña incorrecta'});
        }
    }
    catch{
        res.json({message: error.message});
    }
};

const registrarUsuario = async (req,res)=>{
    try{
        const usuario = await administradorModel.findOne({where: {usuario: req.body.usuario}});
        if(usuario!=null){
            res.json({message: 'Este usuario ya existe'});
        }
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(req.body.password,salt);
        await administradorModel.create({usuario:req.body.usuario,password:hash});
        res.status(201);
        res.json({message: 'Administrador creado con exito'});
    }
    catch{
        res.json({message: error.message});
    }
};

module.exports={iniciarSesion,registrarUsuario};