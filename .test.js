const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const app = require("./index");

app.use(express.json());

describe("Scoring Service Integration Test", () => {
  beforeAll(async () => {
    await mongoose.connect(
      "mongodb+srv://ahmadsiddiqp:cIEiu8ExZFm3fatk@cluster0.pzfilcq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should return a score for a given quiz attempt", async () => {
    const res = await request(app).post("/api/score/grade").send({
      userId: "6667213ac2417c44558128a7",
      quizId: "66672136254671237c22cdba",
      answerId: "6667217fb5db7f17b97d31bc",
    });

    expect(res.statusCode).toEqual(200);

    expect(res.body.score).toBeGreaterThanOrEqual(0);
  });
});
