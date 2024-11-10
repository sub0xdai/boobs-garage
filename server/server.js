
import dotenv from 'dotenv';
dotenv.config();

// Run environment check on startup
const requiredEnvVars = ['PORT', 'JWT_SECRET', 'REFRESH_TOKEN_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables. Running env manager...');
  import('./scripts/manageEnv.js'); // Use dynamic import
  // Reload environment variables
  dotenv.config();
}

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';

// Import routes
import serviceRoutes from './src/routes/serviceRoutes.js';
import feedbackRoutes from './src/routes/feedbackRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import blogRoutes from './src/routes/blogRoutes.js';

// Middleware
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Static file serving
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/feedback', feedbackRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

