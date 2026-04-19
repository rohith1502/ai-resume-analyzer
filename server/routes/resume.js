const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const protect = require('../middleware/authMiddleware');
const { analyze, getHistory, getAnalysisById, deleteAnalysis } = require('../controllers/resumeController');

router.post('/analyze', protect, upload.single('resume'), analyze);
router.get('/history', protect, getHistory);
router.get('/history/:id', protect, getAnalysisById);
router.delete('/history/:id', protect, deleteAnalysis);

module.exports = router;
