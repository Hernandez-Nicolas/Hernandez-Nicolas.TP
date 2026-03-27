module.exports = (req,res,next) => {
    const body = req.body
    if(req.file!=undefined&&body.nombre&&body.categoria&&body.precio){
        if(typeof body.precio != 'number'){
            res.status(500).send({message: 'Precio invalido'});
        }
        next();
    }
    else{
        res.status(500).send({message: 'Datos insuficientes'});
    }
}