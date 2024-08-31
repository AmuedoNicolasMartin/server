/*const mongoose = require('mongoose');
const uri = process.env.DB;
const bd = mongoose.connect(uri);

if (!bd){
    console.log('No se pudo conectar a la base de datos no relacional.')
}else{
    console.log('Conexion no relacional establecida.')
}

module.exports = bd;
/*forma de importar bd si use module.exports seria:
{ bd } = require('./db-connection.js');
*/
