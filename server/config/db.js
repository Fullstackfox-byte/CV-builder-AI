import mongoose from 'mongoose';

export const isDBReady = () => mongoose.connection.readyState === 1;

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) return console.warn('[db] MONGO_URI not set - running without database (client keeps CVs locally).');
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
    console.log('[db] MongoDB connected');
  } catch (e) {
    console.warn('[db] MongoDB unavailable - continuing without database:', e.message);
  }
}
