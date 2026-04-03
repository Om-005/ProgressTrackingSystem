const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    required: [true, 'Please provide a date'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
  },
  hours: {
    type: Number,
    required: [true, 'Please provide hours studied'],
  },
  notes: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('Log', logSchema);
