const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  quizId: {
    type: Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  answers: [
    {
      questionId: {
        type: Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
      },
      choiceId: {
        type: Schema.Types.ObjectId,
        required: true,
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Answer', AnswerSchema);
