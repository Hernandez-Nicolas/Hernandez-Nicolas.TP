const db = require("../data/db");

const {DataTypes} = require("sequelize");

const ventaModel = db.define("tickets",{
    nombre: {type: DataTypes.STRING},
    fecha: {type: DataTypes.DATE},
    precio_total: {type: DataTypes.FLOAT}
});

module.exports=ventaModel;