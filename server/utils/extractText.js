const fs = require('fs');
const path = require('path');

const extractTextFromPDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  // Must require inside function — pdf-parse has import side effects
  const pdfParse = require('pdf-parse');
  const data = await pdfParse(dataBuffer);
  return data.text;
};

const extractTextFromDOCX = async (filePath) => {
  const mammoth = require('mammoth');
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
};

const extractTextFromFile = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.pdf') {
    return await extractTextFromPDF(filePath);
  } else if (ext === '.docx') {
    return await extractTextFromDOCX(filePath);
  } else {
    throw new Error('Unsupported file type. Only PDF and DOCX allowed.');
  }
};

module.exports = { extractTextFromFile };
