import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import userRoutes from './routes/users.js';
import authRoutes from './routes/authentications.js';
import companyRoutes from './routes/companies.js';
import categoryRoutes from './routes/categories.js';
import jobRoutes from './routes/jobs.js';
import applicationRoutes from './routes/applications.js';
import bookmarkRoutes from './routes/bookmarks.js';
import documentRoutes from './routes/documents.js';
import profileRoutes from './routes/profile.js';

import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/users', userRoutes);
app.use('/authentications', authRoutes);
app.use('/companies', companyRoutes);
app.use('/categories', categoryRoutes);
app.use('/jobs', jobRoutes);
app.use('/applications', applicationRoutes);
app.use(bookmarkRoutes);
app.use('/documents', documentRoutes);
app.use('/profile', profileRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://${process.env.HOST || 'localhost'}:${PORT}`);
});