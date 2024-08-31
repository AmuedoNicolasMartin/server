require('dotenv').config();
import rutas from './rutas/rutas.js';
require('./db-connection.js');
const dataSQL = require('./dbpg-connection.js').dataSQL;
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

dataSQL(); //conexion a base relacional Postrgresql.

app.use(cors());
app.use(bodyParser.urlencoded({extended:false})); 
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.text());

app.get('/',(req,res)=>{
    res.json({message:'Wellcome!', alimentos:['hamburguesa','pancho','pizza','helado'],
        ingredientes:[{id:1,pan:true},{id:2,pan:false},{id:3,pan:true},{id:4,pan:false}]})
});


app.use('/rutas', rutas);

//--------------conexion a base Relacional SQL-------------------------------------------------------
/*const dataSQL = async () =>{
       const client = new Client({
        user: 'nicolas-2021',
        host: 'localhost',
        database: 'my_db',
        password: 'password',
        port: 5432,
       
    });

    await client.connect();

    const res = await client.query("select nombre from usuarios where edad=14");

    //debugger; (esto es para debaguear hasta esta linea O.o)

    const result = res.rows;

    await client.end();

    return result;

};
dataSQL().then((result)=>{
    console.log(result);
});
*/
//----------------------------------------------------------------------------------------------------------

app.listen(process.env.PORT, ()=>{
    console.log(`megaProject is listening in ${process.env.PORT}`);
})

