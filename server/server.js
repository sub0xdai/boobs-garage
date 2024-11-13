import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

// ES module path fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import serviceRoutes from './src/routes/serviceRoutes.js';
import feedbackRoutes from './src/routes/feedbackRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import blogRoutes from './src/routes/blogRoutes.js';
import userPreferencesRoutes from './src/routes/userPreferencesRoutes.js';
import homeImageRoutes from './src/routes/homeImageRoutes.js';

// Create uploads directory if it doesn't exist (single definition)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Allow image loading
}));
app.use(cors());
app.use(express.json());

// Static file serving - fixed path
app.use('/uploads', express.static(uploadsDir));

// Debug logging
app.use((req, res, next) => {
  console.log('API Request:', req.method, req.path);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/preferences', userPreferencesRoutes);
app.use('/api', homeImageRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Uploads directory:', uploadsDir); // Debug log
});
