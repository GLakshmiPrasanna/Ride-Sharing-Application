import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, required: true },
    feedbackText: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const FeedbackModel = mongoose.model('Feedback', feedbackSchema);

export default FeedbackModel;
