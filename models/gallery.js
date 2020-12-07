const mongoose = require('mongoose');

const { Schema } = mongoose;
const gallerySchema = new Schema({
  writer: {
    type: String,
    required: true,
    ref: 'User'
  },
  content: {
     type: String,
     required: false,
  },
  img: {
     type: String,
     required: true,
  },
  createdAt: {
     type: Date,
     default: Date.now,
  },
});

module.exports = mongoose.model('Gallery', gallerySchema);



