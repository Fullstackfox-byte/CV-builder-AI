import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Single .env at the project root (cv-builder-ai/.env)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
