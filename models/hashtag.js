const mongoose = require('mongoose');

const { Schema } = mongoose;
const hashtagSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  createdAt: {
     type: Date,
     default: Date.now,
  },
  
});

module.exports = mongoose.model('Hashtag', hashtagSchema);
