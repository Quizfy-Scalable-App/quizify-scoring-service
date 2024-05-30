const express = require('express');
const mongoose = require('mongoose');
const quizRoutes = require('./routes/quiz');
const config = require('./config/config');
const joinRoutes = require('./routes/join');
const cors = require("cors");
const app = express();

app.use(cors());

app.use(express.json());
app.use('/api/quiz', quizRoutes);
app.use('/api/join', joinRoutes);

mongoose.connect(config.mongoURI).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error(err.message);
  process.exit(1);
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Quiz Service started on port ${PORT}`));

