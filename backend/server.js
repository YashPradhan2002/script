const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const boardRoutes = require('./routes/boardRoute');
const taskRoutes = require('./routes/taskRoute');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(`mongodb+srv://taskboard:1234@taskboard.vgibji7.mongodb.net/?retryWrites=true&w=majority&appName=TaskBoard`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/boards', boardRoutes);
app.use('/tasks', taskRoutes);

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));