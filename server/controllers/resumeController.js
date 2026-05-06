const path = require('path');
const fs = require('fs');
const { extractTextFromFile } = require('../utils/extractText');
const { analyzeResume } = require('../utils/grokAnalyzer');
const { fetchJobRecommendations } = require('../utils/jobSearch');
const ResumeAnalysis = require('../models/ResumeAnalysis');

exports.analyze = async (req, res) => {
  try {
    // 1. Validate file uploaded
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Resume file is required' });
    }

    // 2. Validate required fields
    const { jobRole, jobDescription, company } = req.body;
    if (!jobRole || !jobDescription) {
      return res.status(400).json({ success: false, message: 'Job role and job description are required' });
    }

    // 3. Get userId from auth middleware
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: no user id' });
    }

    console.log('Analyzing resume for userId:', userId);
    console.log('File:', req.file.filename);

    // 4. Extract text from uploaded file
    const filePath = req.file.path;
    let resumeText;
    try {
      resumeText = await extractTextFromFile(filePath);
      console.log('Extracted text length:', resumeText.length);
    } catch (extractErr) {
      return res.status(400).json({ success: false, message: 'Failed to extract text from file: ' + extractErr.message });
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ success: false, message: 'Could not extract enough text from resume. Ensure it is not a scanned image.' });
    }

    // 5. Call AI to analyze
    let analysisResult;
    try {
      analysisResult = await analyzeResume(resumeText, jobRole, jobDescription, company);
      console.log('ATS Score:', analysisResult.atsScore);
    } catch (aiErr) {
      return res.status(500).json({ success: false, message: 'AI analysis failed: ' + aiErr.message });
    }

    // 6. Fetch job recommendations if score >= 75
    let jobRecommendations = [];
    if (analysisResult.atsScore >= 75) {
      jobRecommendations = await fetchJobRecommendations(jobRole, company);
      console.log('Job recommendations count:', jobRecommendations.length);
      console.log('Job recommendations:', JSON.stringify(jobRecommendations.slice(0, 2), null, 2));
    }

    // 7. Save to MongoDB
    const analysis = await ResumeAnalysis.create({
      userId,
      filename: req.file.originalname || req.file.filename,
      jobRole,
      company: company || '',
      result: analysisResult,
      jobRecommendations,
    });

    // 8. Clean up uploaded file
    try {
      fs.unlinkSync(filePath);
    } catch (e) {
      console.warn('Could not delete temp file:', e.message);
    }

    // 9. Return response
    return res.status(200).json({
      success: true,
      message: 'Resume analyzed successfully',
      data: {
        analysisId: analysis._id,
        ...analysisResult,
        jobRecommendations,
        jobRole,
        company: company || '',
      },
    });

  } catch (err) {
    console.error('Resume analyze error:', err.message);
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to analyze resume',
    });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const analyses = await ResumeAnalysis.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select('filename jobRole company result.atsScore result.verdict createdAt');

    return res.status(200).json({
      success: true,
      data: analyses,
    });
  } catch (err) {
    console.error('History error:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAnalysisById = async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...analysis.result,
        jobRecommendations: analysis.jobRecommendations || [],
        filename: analysis.filename,
        jobRole: analysis.jobRole,
        company: analysis.company,
        createdAt: analysis.createdAt,
      },
    });
  } catch (err) {
    console.error('Get analysis error:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteAnalysis = async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }

    await ResumeAnalysis.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Analysis deleted successfully',
    });
  } catch (err) {
    console.error('Delete error:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMoreJobs = async (req, res) => {
  try {
    const { jobTitle, page } = req.body;

    if (!jobTitle) {
      return res.status(400).json({ success: false, message: 'Job title is required' });
    }

    const pageNumber = page || 2;
    const jobRecommendations = await fetchJobRecommendations(jobTitle, '', pageNumber);

    return res.status(200).json({
      success: true,
      jobs: jobRecommendations,
    });
  } catch (err) {
    console.error('Get more jobs error:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};
