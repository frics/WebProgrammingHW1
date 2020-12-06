const mongoose = require('mongoose');


const { Schema } = mongoose;
const userSchema = new Schema({
  UserId: {
    type: String,
    required: true,
    unique: true,
  },
  UserName: {
    type : String,
    required: true,
  },
  UserPassword: {
    type: String,
    required: true,
  },
});


module.exports = mongoose.model('User', userSchema);
