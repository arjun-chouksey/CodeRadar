const mongoose = require('mongoose');

const ContestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['codeforces', 'leetcode'],
    lowercase: true
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
    type: Number,  // Duration in minutes
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming'
  },
  platformId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Create a compound index to ensure uniqueness
ContestSchema.index({ platformId: 1, platform: 1 }, { unique: true });

// Create indexes for frequent queries
ContestSchema.index({ platform: 1 });
ContestSchema.index({ status: 1 });
ContestSchema.index({ startTime: 1 });

module.exports = mongoose.model('Contest', ContestSchema);
