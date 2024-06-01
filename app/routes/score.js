// routes/score.js
const express = require("express");
const axios = require("axios");
const Score = require("../models/Score");

const router = express.Router();

// Route untuk melakukan penilaian otomatis
router.post("/grade", async (req, res) => {
  const { answerId, quizId, userId } = req.body;

  try {
    const answerRes = await axios.get(
      `https://quizify-quiz-service.vercel.app/api/quiz/answer/${answerId}`
    );
    const answerItem = answerRes.data;
    const answers = answerItem.answers;

    // Ambil pertanyaan kuis
    const questionsRes = await axios.get(
      `https://quizify-quiz-service.vercel.app/api/quiz/questions/${quizId}`
    );
    const questions = questionsRes.data;
    // Hitung nilai
    let correctAnswers = 0;
    let wrongAnswers = 0;
    const totalQuestions = questions.length;

    for (let answer of answers) {
      const question = questions.find((q) => q._id === answer.questionId);
      if (question) {
        const correctChoice = question.choices.find((choice) => choice.isCorrect);
        if (correctChoice && correctChoice._id === answer.choiceId) {
          correctAnswers += 1;
        } else {
          wrongAnswers += 1;
        }
      }
    }

    const score =(correctAnswers / totalQuestions) * 100;

    // Simpan nilai ke database
    const newScore = new Score({
      user: userId,
      quizId: quizId,
      answerId: answerId,
      score: score,
      correctAnswers: correctAnswers,
      wrongAnswers: wrongAnswers,
      totalQuestions: totalQuestions,
    });

    await newScore.save();
    res.json(newScore);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// Mendapatkan skor dari answerid
router.get("/answer/:answerId", async (req, res) => {
  const { answerId } = req.params;
  try {
    const score = await Score
      .findOne({ answerId })
    res.json(score);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Mendapatkan ranking user dari satu kuis
router.get("/ranking/:quizId", async (req, res) => {
  const { quizId } = req.params;
  try {
    const scores = await Score.find({ quizId }).sort({
      score: -1,
      createdAt: 1,
    });

    // Mendapatkan nama pengguna berdasarkan userId dan menggabungkannya dengan skor
    const ranking = await Promise.all(
      scores.map(async (score) => {
        try {
          const response = await axios.get(
            `https://quizify-auth-service.vercel.app/api/auth/user/${score.user}`
          );
          const user = response.data;
          return { name: user.name, score: score.score };
        } catch (err) {
          console.error(
            `Error fetching user data for userId: ${score.user}`,
            err
          );
          return { name: "Unknown User", score: score.score };
        }
      })
    );

    res.json(ranking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
