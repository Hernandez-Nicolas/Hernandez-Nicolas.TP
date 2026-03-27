const db = require('../data/db');

const {DataTypes} = require('sequelize');

const administradorModel = db.define("administradores",{
    usuario: {type: DataTypes.STRING},
    password: {type: DataTypes.STRING}
});

module.exports=administradorModel;