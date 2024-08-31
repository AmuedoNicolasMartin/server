const mongoose = require('mongoose');
const { Schema } = mongoose;
const userSchema = new Schema ({
    pass:{type:String, required:true},
    email:{type:String, required:true},
    name:{type:String, required:true},
    fecha:{type:Date, required:true},
    age:{type:Number, required:true},
    activo:{type:Boolean, required:true}
});

const user = mongoose.model('user', userSchema);

exports.user = user
/*formas para importar user si use exports.user serian:
const { user } = require('./models.js');
const user = require('./models.js').user;
*/
