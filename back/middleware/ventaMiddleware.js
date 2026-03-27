module.exports=(req,res,next)=>{
    if(req.body.nombre&&req.body.precio_total&&req.body.productos!=[]){
        if(typeof req.body.precio_total != 'number'){
            res.status(500).send({message: 'Precio total no valido'});
        }
        req.body.productos.forEach(producto=>{
            if(!producto.id||!producto.cantidad){
                res.status(500).send({message: 'datos de productos insuficientes'});
            }
        });
        next();
    }
    else{
        res.status(500).send({message: 'datos insuficientes'});
    }
}