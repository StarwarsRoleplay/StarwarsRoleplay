const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Star Wars Roleplay API is running...');
});

const factionsRouter = require('./src/routes/factions');
app.use('/api/v1/factions', factionsRouter);

module.exports = app;
