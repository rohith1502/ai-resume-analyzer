import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ResumeAnalyzerForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    jobRole: '',
    jobDescription: '',
    company: '',
  });
  const [file, setFile] = useState(null);

  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PDF and DOCX files are allowed');
      return false;
    }

    return true;
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors[0];
        if (error.code === 'file-too-large') {
          toast.error('File size must be less than 5MB');
        } else if (error.code === 'file-invalid-type') {
          toast.error('Only PDF and DOCX files are allowed');
        }
        return;
      }

      if (acceptedFiles.length > 0 && validateFile(acceptedFiles[0])) {
        setFile(acceptedFiles[0]);
      }
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!file) {
      alert('Please upload a resume file');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('jobRole', formData.jobRole);
    formDataToSend.append('jobDescription', formData.jobDescription);
    formDataToSend.append('company', formData.company);
    formDataToSend.append('resume', file);

    onSubmit(formDataToSend);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Job Role */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Job Role *
        </label>
        <input
          type="text"
          name="jobRole"
          value={formData.jobRole}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-navy-900 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 focus:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all text-white placeholder-gray-500"
          placeholder="e.g., Senior Software Engineer"
          required
        />
      </div>

      {/* Job Description */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Job Description *
        </label>
        <textarea
          name="jobDescription"
          value={formData.jobDescription}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 bg-navy-900 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 focus:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all text-white placeholder-gray-500 resize-none"
          placeholder="Paste the job description here..."
          required
        />
      </div>

      {/* Company Name */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Company Name (Optional)
        </label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-navy-900 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 focus:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all text-white placeholder-gray-500"
          placeholder="e.g., Google, Microsoft"
        />
      </div>

      {/* File Dropzone */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Resume File *
        </label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-purple-400 bg-purple-500/10'
              : 'border-purple-500/50 bg-navy-900 hover:border-purple-400 hover:bg-purple-500/5'
          }`}
        >
          <input {...getInputProps()} />
          {file ? (
            <div className="flex items-center justify-center gap-3 text-purple-400">
              <FileText className="w-6 h-6" />
              <span className="font-medium">{file.name}</span>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-8 h-8 mx-auto text-purple-400" />
              <p className="text-gray-300">
                {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}
              </p>
              <p className="text-gray-500 text-sm">or click to browse</p>
              <p className="text-gray-500 text-xs">PDF or DOCX, max 5MB</p>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-4 bg-purple-500 hover:bg-purple-400 text-white font-semibold rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:shadow-[0_0_30px_rgba(124,58,237,0.7)]"
      >
        Analyze Resume
      </button>
    </form>
  );
};

export default ResumeAnalyzerForm;
