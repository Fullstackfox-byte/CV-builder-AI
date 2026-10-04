import './config/env.js'; // must be first: loads ../.env
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { connectDB, isDBReady } from './config/db.js';
import { llmEnabled } from './services/llm.js';
import sanitize from './middleware/sanitize.js';
import cvRoutes from './routes/cvRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: (process.env.CLIENT_URL || 'http://localhost:5173').split(',') }));
app.use(express.json({ limit: '2mb' }));
app.use(sanitize);
app.use(morgan('dev'));
app.use('/api', rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: true, legacyHeaders: false }));

app.get('/api/health', (req, res) => res.json({ ok: true, db: isDBReady(), ai: llmEnabled() ? process.env.AI_PROVIDER : 'local' }));
app.use('/api/cvs', cvRoutes);
app.use('/api/ai', aiRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().finally(() =>
  app.listen(PORT, () => console.log(`[server] http://localhost:${PORT}  (AI: ${llmEnabled() ? process.env.AI_PROVIDER : 'local engine'})`))
);
