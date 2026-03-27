module.exports = (req,res,next) => {
    if(req.body.usuario&&req.body.password){
        next();
    }
    else{
        res.status(500).send({message: 'Datos insuficientes'});
    }
}