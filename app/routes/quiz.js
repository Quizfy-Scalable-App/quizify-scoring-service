const express = require('express');
const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const auth = require('../middleware/auth');

const router = express.Router();

// Membuat Kuis
router.post('/create', auth, async (req, res) => {
  const { title, startTime, endTime } = req.body;
  const userId = req.user.id;

  try {
    const quiz = new Quiz({ user: userId, title, startTime, endTime });
    await quiz.save();

    res.status(201).json(quiz);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add a question to a quiz
router.post('/:quizId/question', auth, async (req, res) => {
  try {
      const { text, choices } = req.body;
      const quizId = req.params.quizId;

      if (!Array.isArray(choices) || choices.length === 0) {
          return res.status(400).json({ msg: 'Choices must be a non-empty array' });
      }

      const question = new Question({
          text,
          choices,
          quizId
      });

      await question.save();
      res.json(question);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
});

// Mendapatkan Kuis oleh User
router.get('/user/', auth, async (req, res) => {
  const userId = req.user.id;
  try {
    const quizzes = await Quiz.find({ user: userId });
    res.json(quizzes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Mendapatkan Semua Kuis
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get quiz by code
router.get('/code/:code', async (req, res) => {
  try {
      const quiz = await Quiz.findOne({ code: req.params.code });
      if (!quiz) {
          return res.status(404).json({ msg: 'Quiz not found' });
      }
      res.json(quiz);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
});

// get quiz by id
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Mendapatkan semua pertanyaan untuk kuis tertentu
router.get('/questions/:quizId', async (req, res) => {
  try {
    const questions = await Question.find({ quizId: req.params.quizId });
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Submit answers for a quiz
router.post('/:quizId/answer', auth, async (req, res) => {
  const { answers } = req.body;
  const userId = req.user.id;
  const quizId = req.params.quizId;

  try {
    const answer = new Answer({
      user: userId,
      quizId,
      answers,
    });
    console.log(answer);
    await answer.save();
    res.status(201).json(answer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Endpoint untuk mendapatkan jawaban berdasarkan _id
router.get('/answer/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const answer = await Answer.findById(id);
    console.log(answer);
    if (!answer) {
      return res.status(404).json({ msg: 'Answer not found' });
    }
    res.json(answer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



// get quiz and questions by id, menambahkan data questions ke kuis yang berisi array questions
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    const showQuiz = quiz.toObject();
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }
    const questions = await Question.find({ quizId: req.params.id });
    showQuiz.questions = questions;
    console.log(showQuiz);
    res.json(showQuiz);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



module.exports = router;
