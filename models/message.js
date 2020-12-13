const mongoose = require('mongoose');

const { Schema } = mongoose;
const messageSchema = new Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
   type: String,
   required: true,
 },
message: {
   type: String,
   required: true,
 },
  createdAt: {
     type: Date,
     default: Date.now,
  },
  
});

module.exports = mongoose.model('Hashtag', hashtagSchema);
