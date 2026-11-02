
const mysql = require("mysql2/promise");

const conexion = mysql.createPool({

    host: process.env.DB_HOST || "db",

    user: process.env.DB_USER || "root",

    password: process.env.DB_PASSWORD || "123456",

    database: process.env.DB_NAME || "gestion_estudiantes",

    waitForConnections: true,

    connectionLimit: 10,

    queueLimit: 0

});

module.exports = conexion;
