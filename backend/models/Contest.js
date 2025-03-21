const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    enum: ['Codeforces', 'LeetCode']
  },
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['UPCOMING', 'ONGOING', 'COMPLETED'],
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
contestSchema.index({ platform: 1, startTime: 1 });

module.exports = mongoose.model('Contest', contestSchema);
