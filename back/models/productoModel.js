const db = require("../data/db.js");

const {DataTypes} = require("sequelize");

const productoModel = db.define("productos",{
    nombre: {type: DataTypes.STRING},
    categoria: {type: DataTypes.STRING},
    descripcion: {type: DataTypes.STRING},
    precio: {type: DataTypes.FLOAT},
    actibo: {type: DataTypes.TINYINT},
    imgURL: {type: DataTypes.STRING}
});

module.exports = productoModel;