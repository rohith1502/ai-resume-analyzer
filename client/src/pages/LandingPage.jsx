import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, FileText, Zap } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center px-4">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto">
        {/* Floating glow effect behind */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
        
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500/30 blur-xl rounded-full"></div>
            <div className="relative bg-navy-800 p-6 rounded-2xl shadow-[0_0_40px_rgba(124,58,237,0.3)]">
              <Sparkles className="w-12 h-12 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Headline with violet gradient */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent">
          AI Resume Analyzer
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Optimize your resume for ATS systems and land more interviews with AI-powered insights
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/signup"
            className="group relative px-8 py-4 bg-purple-500 hover:bg-purple-400 text-white font-semibold rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:shadow-[0_0_30px_rgba(124,58,237,0.7)]"
          >
            Get Started
            <Zap className="inline-block ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
          </Link>
          
          <Link
            to="/login"
            className="px-8 py-4 bg-navy-800 hover:bg-navy-700 text-white font-semibold rounded-lg border border-purple-500/30 transition-all duration-300 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)]"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="bg-navy-800 p-6 rounded-xl border border-purple-500/20 shadow-[0_0_30px_rgba(124,58,237,0.15)] hover:shadow-[0_0_40px_rgba(124,58,237,0.25)] transition-all duration-300">
          <FileText className="w-8 h-8 text-purple-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">ATS Optimization</h3>
          <p className="text-gray-400 text-sm">Ensure your resume passes through applicant tracking systems</p>
        </div>

        <div className="bg-navy-800 p-6 rounded-xl border border-purple-500/20 shadow-[0_0_30px_rgba(124,58,237,0.15)] hover:shadow-[0_0_40px_rgba(124,58,237,0.25)] transition-all duration-300">
          <Sparkles className="w-8 h-8 text-purple-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">AI Analysis</h3>
          <p className="text-gray-400 text-sm">Get intelligent feedback powered by advanced AI</p>
        </div>

        <div className="bg-navy-800 p-6 rounded-xl border border-purple-500/20 shadow-[0_0_30px_rgba(124,58,237,0.15)] hover:shadow-[0_0_40px_rgba(124,58,237,0.25)] transition-all duration-300">
          <Zap className="w-8 h-8 text-purple-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Instant Results</h3>
          <p className="text-gray-400 text-sm">Receive comprehensive analysis in seconds</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
