const mongoose = require("mongoose");
require('mongoose-type-email');
mongoose.SchemaTypes.Email.defaults.message = 'direccion de correo invalida'
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: {type:String, required: true},
  password: {type:String, required: true},
  email : {type: mongoose.SchemaTypes.Email, required: true},
  balance : {type: Number, default: 0.25},
  level: {type: String, enum: ["Bronce", "Plata", "Oro"], default: "Bronce"},
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model("User", userSchema);

module.exports = User;