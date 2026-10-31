const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  bookTitle: {
    type: String,
    required: true,
    trim: true
  },
  memberName: {
    type: String,
    required: true,
    trim: true
  },
  issueDate: {
    type: Date,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Issued', 'Returned'],
    default: 'Issued'
  }
})

module.exports = mongoose.model('Transaction', transactionSchema)
