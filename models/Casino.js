const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const casinoSchema = new Schema({
  name : String,
  email : String,
  balance : Number,
  level: Number,
});

const Casino = mongoose.model('Casino', casinoSchema);
module.exports = Casino;