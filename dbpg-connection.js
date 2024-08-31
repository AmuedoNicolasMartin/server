const { Client } = require('pg');

const client = new Client({
   user: 'nicolas-2021',
   host: 'localhost',
   database: 'my_db',
   password: 'password',
   port: 5432,
});

const dataSQL = async () =>{ 
   try {
      await client.connect();
      console.log('Conexión establecida.');
  } catch (error) {
      console.error('Error de conexión:', error);
  }
 return;
 }


//las exporto por separado.
exports.dataSQL = dataSQL;
exports.client = client;