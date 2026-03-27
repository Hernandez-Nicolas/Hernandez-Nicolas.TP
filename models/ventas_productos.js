const db = require("../data/db");

const {DataTypes} = require("sequelize");

const ventas_productosModel = db.define("tickets_productos",{
    cantidad: {type: DataTypes.INTEGER}
});

module.exports=ventas_productosModel;