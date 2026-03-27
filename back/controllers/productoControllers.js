const { Json } = require('sequelize/lib/utils');
const productoModel = require('../models/productoModel.js');
const fs = require("fs");

const url = 'http://localhost:3000/';

const traerProductos = async (req,res)=>{
    try{
        let productos = {}
        if(JSON.stringify(req.query)=='{}'){
            productos = await productoModel.findAll();
            productos.map(p=>{
                p.imgURL = url+'imagen/'+p.imgURL;
            });
        }
        else{
            req.query.categoria?
            productos=await productoModel.findAll({where: {categoria: req.query.categoria}}):/* if */
            productos=await productoModel.findAll();/* else */

            if(req.query.limite!=null){
                const paramLimite = JSON.parse(req.query.limite);
                const paramOffset = JSON.parse(req.query.offset||0);
                const productosAux = productos;
                productos = {
                    cantidad: productosAux.length,
                    siguiente: paramOffset+paramLimite<productosAux.length?
                        url+`?limite=${paramLimite}`+(paramOffset?
                        `&offset=${paramOffset+paramLimite}`:/* si hay offset */
                        `&offset=${paramLimite}`):
                        null,/* si no hay offset */
                    anterior: paramOffset?
                        url+`?limite=${paramLimite}`+(paramOffset-paramLimite>0?
                            `&offset=${paramOffset-paramLimite}`:/* si hay offset y es uno avanzado */
                            ''):/* si hay offset y era el primer */
                        null,/* si no hay offset */
                    productosPaginados: []
                }
                for(let i=paramOffset;i<productosAux.length&&i<paramOffset+paramLimite;i++){
                    productos.productosPaginados.push(productosAux[i]);
                }
                productos.productosPaginados.map(p=>{
                    p.imgURL = url+'imagen/'+p.imgURL;
                });
            }
        }
        res.json(productos);
    }
    catch(error){
        res.json({message: error.message});
    }
};

const traerUnProducto = async (req,res)=>{
    try{
        let producto = await productoModel.findByPk(req.params.id);
        producto.imgURL = url+'imagen/'+producto.imgURL;
        res.json(producto);
    }
    catch(error){
        res.json({message: error.message});
    }
};

const subirProducto = async (req,res)=>{
    try{
        const nuevoProducto = {
            nombre: req.body.nombre,
            categoria: req.body.categoria,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            actibo: true,
            imgURL: req.file.filename
        }
        await productoModel.create(nuevoProducto);
        res.status(201);
        res.json({respuesta: "creado con exito"})
    }
    catch(error){
        res.json({message: error.message});
    }
};

const modificarProducto = async (req,res)=>{
    try{
        let productoModificado = {}
        if(req.body.nombre){productoModificado["nombre"]=req.body.nombre}
        if(req.body.categoria){productoModificado["categoria"]=req.body.categoria}
        if(req.body.descripcion){productoModificado["descripcion"]=req.body.descripcion}
        if(req.body.precio&&parseFloat(req.body.precio)!=NaN){productoModificado["precio"]=req.body.precio}
        if(req.body.activo){
            if( (typeof JSON.parse(req.body.activo.toLowerCase())) =="boolean"){
                productoModificado["actibo"] = JSON.parse(req.body.activo.toLowerCase());
            }
            else if( (typeof JSON.parse(req.body.activo.toLowerCase())) =="number"){
                JSON.parse(req.body.activo.toLowerCase())>0?
                productoModificado["actibo"]=true:productoModificado["actibo"]=false
            }
        }
        if(req.file){
            productoModificado["imgURL"] = req.file.filename;
            const prodCambiarImg = await productoModel.findByPk(req.params.id);
            const imgABorrar = prodCambiarImg.imgURL;
            fs.unlink('./public/images/'+imgABorrar,err=>{
                if(err) throw err;
            });
        }
        await productoModel.update(productoModificado, {where: {id: req.params.id}});
        res.json({respuesta: `se modifico el producto id:${req.params.id}`});
    }
    catch(error){
        res.json({message: error.message});
    }
};

module.exports = {
    traerProductos,
    traerUnProducto,
    subirProducto,
    modificarProducto
};