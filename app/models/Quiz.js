const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  endTime: {
    type: Date,
    required: true,
  },
  code: {
    type: String,
    unique: true,
    default: "1234",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate a unique 6-digit code
QuizSchema.pre('save', function(next) {
  if (this.isNew) {
    this.code = Math.floor(100000 + Math.random() * 900000).toString();
  }
  next();
});

module.exports = mongoose.model('Quiz', QuizSchema);
