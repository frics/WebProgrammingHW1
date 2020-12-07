const mongoose = require('mongoose');

const { Schema } = mongoose;
const boardSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  writer: {
    type: String,
    required: true,
    ref: 'User'
  },
  createdAt: {
     type: Date,
     default: Date.now,
  },
  content: {
    type: String,
    required: true,
 },
});

module.exports = mongoose.model('Board', boardSchema);
