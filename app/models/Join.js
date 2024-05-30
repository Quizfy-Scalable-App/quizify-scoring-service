const mongoose = require('mongoose');

const JoinSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  answers: [
    {
      question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
      },
      choice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Option',
        required: true,
      },
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Join', JoinSchema);
