const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: {ObjectID } } = Schema;
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
  content: {
     type: String,
     required: true,
  },
  createdAt: {
     type: Date,
     default: Date.now,
  },
});

module.exports = mongoose.model('Board', boardSchema);
