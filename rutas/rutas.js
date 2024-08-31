import express from 'express';
const user = require('../models.js').user;
const bcrypt = require('bcrypt');
const client = require('../dbpg-connection.js').client;

async function createUser(pass,email,name,fecha,age,activo) {
    const User = new user({
        pass:await bcrypt.hash(pass, 12),
        email:email,
        name:name,
        fecha:fecha,
        age:age,
        activo:activo
    });
    const savedUser = await User.save();
    return savedUser;
}

async function findEmail(email){
    return user.findOne({email:email}).exec();
}

async function findMulti(name){
    return user.find({name:name}).exec();
  }

  async function findId(id){
    return user.findById(id).exec();
  }

  async function findUserName(name){
    return user.findOne({name:name}).exec();
  }

  async function removeById(id){
    return user.deleteOne(id).exec(); 
  }

const rutas = express.Router();

rutas.get('/home', (req,res)=>{
    res.json({message: 'Bienvenido a Home!', numero: 17})
})

//-----------------Pruebas con bases de datos Relacionales-----------------------------------------------------
rutas.get('/consultasql',async(req,res) =>{ //notar que de este lado no necesito llenar la url con el ?queryparam
  try{
    const resp = await client.query(`select nombre from usuarios where edad=${req.query.edad}`);
    const result =  resp.rows;
    //await client.end();
    console.log(result);
    res.send(JSON.stringify(result));
  } catch(error){
    console.error('Errpr en la consulta:',error);
    return res.status(500).send('Error en la consulta');
  }
 
});
//-------------------------------------------------------------------------------------------------------------

rutas.post('/Poster', (req,res)=>{
    const {title, body} = req.body;
    res.json({title:title, body:body})
});

//post example
rutas.post('/postNoRel', async(req,res)=>{
    const { pass, email, name, fecha, age, activo } = req.body;
    //res.json({pass:pass, email:email, name:name, age:age, activo:activo});
    const foundUser = await findEmail(email);
    if (!foundUser){
       const User = createUser(pass,email,name,fecha,age,activo?true:false);
       if (!User){
        return res.status(404).json({error: 'No se pudo crear el usuario.'})
       }
       return res.status(200).json({message: 'El usuario ha sido creado.'})
    }else{
        return res.status(404).json({error: 'El usuario ya existe'})
    }
});

//patch example ___usando for___
/*rutas.patch('/patchNoRel', async(req,res)=>{
    const { pass, name, activo } = req.body;
   
     const user = await findMulti(name);
       if(!user){
         return  res.status(404).json({error: 'Usuario inexistente.'});
       }
       
       for (var i = user.length-1; i >= 0; i--){
        await bcrypt.compare(pass, user[i].pass, (err, Valid) => {
         i+=1; //tener en cuenta que Valid es boolean. hay que sumarle 1 pues al entrar resta 1 porque si.
         console.log(i);
         if (err){
           throw new Error(err)
         }
         console.log(Valid);
         if (Valid == true){
           console.log('Estado modificado correctamente.');
           user[i].activo = activo?true:false;
           user[i].save();
           return;
           //return res.status(200).json({mensaje: 'El estado fue modificado correctamente.'});
         }    
       });
       };
       return res.status(200).json({mensaje: 'Cambios de estado efectuados.', ival: i})
   });*/
   //patch example ___usando for of___ 
   rutas.patch('/patchNoRel', async (req, res) => {
    const { pass, name, activo } = req.body;
    const users = await findMulti(name);
    
    if (!users || users.length === 0) {
      return res.status(404).json({ error: 'Usuario inexistente.' });
    }
  
    for (const user of users) {
      try {
        const valid = await bcrypt.compare(pass, user.pass);
        if (valid) {
          console.log('Estado modificado correctamente.');
          user.activo = activo ? true : false;
          await user.save();
          return res.status(200).json({ mensaje: 'El estado fue modificado correctamente.' });
        }
      } catch (err) {
        return res.status(500).json({ error: 'Error al verificar la contraseña.' });
      }
    }
    
    return res.status(400).json({ mensaje: 'Contraseña incorrecta.' });
  });

//put example
rutas.put('/putNoRel', async(req,res)=>{
  //req.body desestructurado: cada const entre llaves es un atributo del objeto req.body
  const {_id, pass,email, name, fecha, age, activo } = req.body;
  
  if (!name || typeof name !== 'string'){
    return  res.status(400).send('Ese nombre no es valido.');
  }
  const expRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  if (!email || expRegex.test(email)==false){
    return res.status(400).send('El email no es valido.');
  }
  let activoBool = activo?true:false;
  if (! activo in req.body){
    return res.status(400).send('Debe enviar un valor de activo.');
  }else if (typeof activoBool !== 'boolean'){
    return res.status(400).send('Ese activo no es valido.');
  }
  
  var user = await findId(_id);
  
  if(!user){
    return  res.status(404).json({error: 'Usuario inexistente.'});
  }
  
  bcrypt.compare(pass, user.pass, async(err, Valid) => {
    if (err){
      throw new Error(err)
    }
    console.log(Valid);
    if (Valid == true){
      console.log('Datos modificados.');
      user.pass = await bcrypt.hash(pass, 12);
      user.email = email;
      user.name = name;
      user.age = age;
      user.fecha = fecha;
      user.activo = activoBool;
      await user.save();
      return res.status(200).json({mensaje: 'Datos modificados.'});
    }else{
      return res.status(404).json({error: 'Password incorrecta.'})
    } 
  });

});

rutas.delete('/deleteNoRel', async(req,res) => {

  const { pass, name } = req.body;
  const user = await findUserName(name);
  if (user){
  console.log(user);
  bcrypt.compare(pass, user.pass, (err, Valid) => { //tener en cuenta que res es boolean.
    if (err){
      throw new Error(err)
    }
    console.log(Valid);
    if (Valid == true){
      console.log('Usuario Eliminado.')
      removeById(user._id);
      return res.status(200).json({mensaje:'El usuario fue eliminado correctamente.'})
    }else{
      console.log('Password incorrecta.');
      return res.status(404).json({error:'Password incorrecta.'})
    }      
  })
  }else{
    return res.status(404).json({Error:'El usuario no existe.'})
  }


});



export default rutas;