import mongoose from 'mongoose';

const cvSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true, index: true },
    cvId: { type: String, required: true },
    title: { type: String, default: 'Untitled CV', maxlength: 120 },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);
cvSchema.index({ clientId: 1, cvId: 1 }, { unique: true });

export default mongoose.model('CV', cvSchema);
