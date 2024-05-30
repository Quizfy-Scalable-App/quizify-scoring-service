// models/Question.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChoiceSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    isCorrect: {
        type: Boolean,
        required: true
    }
});

const QuestionSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    choices: {
        type: [ChoiceSchema],
        required: true
    },
    quizId: {
        type: Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    }
});

module.exports = mongoose.model('Question', QuestionSchema);
