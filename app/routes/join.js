// services/participation-service/routes/participation.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Join = require('../models/Join');
const Quiz = require('../models/Quiz');

// Join a quiz and submit answers
router.post(
  '/join',
  [
    auth,
    [
      check('quiz', 'Quiz ID is required').not().isEmpty(),
      check('answers', 'Answers are required').isArray({ min: 1 }),
      check('answers.*.question', 'Question ID is required').not().isEmpty(),
      check('answers.*.choice', 'Choice ID is required').not().isEmpty(),
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { quiz, answers } = req.body;

    try {
      // Create new join document
      const newJoin = new Join({
        user: req.user.id,
        quiz,
        answers
      });

      await newJoin.save();
      res.json(newJoin);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
