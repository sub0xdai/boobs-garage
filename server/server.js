// server/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const serviceRoutes = require('./src/routes/serviceRoutes');
const feedbackRoutes = require('./src/routes/feedbackRoutes');

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api/feedback', feedbackRoutes);

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/services', serviceRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
