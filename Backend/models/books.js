const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    default: ''
  },
  available: {
    type: Boolean,
    default: true
  }
})

module.exports = mongoose.model('Book', bookSchema)