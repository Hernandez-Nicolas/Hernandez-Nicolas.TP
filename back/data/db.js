const {Sequelize} = require("sequelize");

/* Crea instancia para conectarse a la base de datos */
const db = new Sequelize("db_plantas","root","",{
    host: "localhost",
    dialect: "mysql",
    port: 3306
});

module.exports = db;