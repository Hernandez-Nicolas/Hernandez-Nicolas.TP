const ventaModel = require("../models/ventaModel");
const ventas_productosModel = require("../models/ventas_productos");
const productoModel = require("../models/productoModel");

const traerVentas = async (req,res)=>{
    try {
        ventaModel.belongsToMany(productoModel,{as: 'productos',through: ventas_productosModel,foreignKey:'id_ticket',otherKey:'id_producto'});
        productoModel.belongsToMany(ventaModel,{as: 'ventas',through: ventas_productosModel,foreignKey:'id_producto',otherKey:'id_ticket'});
        const ventas = await ventaModel.findAll({include: 'productos'});
        for(let i =0;i<ventas.length;i++){
            let cantidades = await ventas_productosModel.findAll({where: {id_ticket: ventas[i].id}});
            ventas[i].productos.forEach(producto=>{
                let index = cantidades.findIndex(cantidad=>cantidad.id_producto==producto.id);
                if(index!=-1){
                    producto["cantidad"]=cantidades[index].cantidad;
                }
            });
        }
        res.json(ventas);
    }
    catch(error){
        res.json({message: error.message});
    }
};

const traerUnaVenta = async (req,res)=>{
    try {
        ventaModel.belongsToMany(productoModel,{as: 'productos',through: ventas_productosModel,foreignKey:'id_ticket',otherKey:'id_producto'});
        productoModel.belongsToMany(ventaModel,{as: 'ventas',through: ventas_productosModel,foreignKey:'id_producto',otherKey:'id_ticket'});
        const venta = await ventaModel.findByPk(req.params.id,{include: 'productos'});
        const cantidades = await ventas_productosModel.findAll({where: {id_ticket: venta.id}});
        venta.productos.forEach(producto=>{
            let index = cantidades.findIndex(cantidad=>cantidad.id_producto==producto.id);
            if(index!=-1){
                producto['cantidad']=cantidades[index].cantidad;
            }
        });
        res.json(venta);
    }
    catch(error){
        res.json({message: error.message});
    }
};

const subirVenta = async (req,res)=>{
    try {
        const nuevaVenta = {
            nombre: req.body.nombre,
            fecha: Date.now(),
            precio_total: req.body.precio_total
        }
        const ventaSubida = await ventaModel.create(nuevaVenta);
        for(let i=0;i<req.body.productos.length;i++){
            let nuevoVentProd={
                id_ticket: ventaSubida.id,
                id_producto: req.body.productos[i].id,
                cantidad: req.body.productos[i].cantidad
            }
            await ventas_productosModel.create(nuevoVentProd);
        }
        res.status(201);
        res.json({respuesta: "creado con exito"});
    }
    catch(error){
        res.json({message: error.message});
    }
};

module.exports={traerVentas,traerUnaVenta,subirVenta};