const mongoose = require('mongoose');

const resumeAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    jobRole: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      default: '',
    },
    result: {
      atsScore: Number,
      strengths: [String],
      weaknesses: [String],
      missingKeywords: [String],
      suggestions: [String],
      verdict: String,
      summaryFeedback: String,
    },
    jobRecommendations: { type: Array, default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
