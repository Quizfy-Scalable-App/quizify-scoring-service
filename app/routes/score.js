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
    let score = 0;
    for (let answer of answers) {
      const question = questions.find((q) => q._id === answer.questionId);
      if (question) {
        const correctChoice = question.choices.find(
          (choice) => choice.isCorrect
        );
        if (correctChoice && correctChoice._id === answer.choiceId) {
          score += 1;
        }
      }
    }

    // Simpan nilai ke database
    const newScore = new Score({
      user: userId,
      quizId: quizId,
      score: score,
    });

    await newScore.save();
    res.json(newScore);
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
