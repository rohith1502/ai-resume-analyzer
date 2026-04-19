import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, FileText, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-navy-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent mb-2">
              Dashboard
            </h1>
            <p className="text-gray-400">Welcome back, {user?.name || 'User'}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-navy-800 hover:bg-navy-700 text-white font-semibold rounded-lg border border-purple-500/30 transition-all duration-300 hover:border-purple-500/50"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Placeholder Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-navy-800 p-8 rounded-2xl border border-purple-500/20 shadow-[0_0_30px_rgba(124,58,237,0.15)]">
            <FileText className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Upload Resume</h3>
            <p className="text-gray-400">Upload your resume to analyze it with AI</p>
          </div>

          <div className="bg-navy-800 p-8 rounded-2xl border border-purple-500/20 shadow-[0_0_30px_rgba(124,58,237,0.15)]">
            <Sparkles className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">View Analysis</h3>
            <p className="text-gray-400">Check your previous resume analysis results</p>
          </div>

          <div className="bg-navy-800 p-8 rounded-2xl border border-purple-500/20 shadow-[0_0_30px_rgba(124,58,237,0.15)]">
            <FileText className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">History</h3>
            <p className="text-gray-400">View your upload and analysis history</p>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-navy-800 p-8 rounded-2xl border border-purple-500/20 shadow-[0_0_30px_rgba(124,58,237,0.15)]">
          <h2 className="text-2xl font-semibold text-white mb-4">Getting Started</h2>
          <p className="text-gray-400">
            This dashboard is a placeholder. The full resume analyzer features will be implemented in the next phase.
            You'll be able to upload resumes, get AI-powered ATS scoring, and receive optimization suggestions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
