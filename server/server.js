// server/src/server.js or index.js
require('dotenv').config();

// Run environment check on startup
const requiredEnvVars = ['PORT', 'JWT_SECRET', 'REFRESH_TOKEN_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables. Running env manager...');
  require('./scripts/manageEnv.js');
  // Reload environment variables
  require('dotenv').config();
}


const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const serviceRoutes = require('./src/routes/serviceRoutes');
const feedbackRoutes = require('./src/routes/feedbackRoutes');
const authRoutes = require('./src/routes/authRoutes');

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api/feedback', feedbackRoutes);

// Routes
app.use('/api/auth', authRoutes);
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
