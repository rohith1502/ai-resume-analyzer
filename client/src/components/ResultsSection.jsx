import React, { useEffect, useRef, useState } from 'react';
import { Check, X, ExternalLink, Rocket } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import JobCardSkeleton from './JobCardSkeleton';

const ResultsSection = ({ result, onAnalyzeAnother }) => {
  const resultsRef = useRef(null);
  const seenJobKeys = useRef(new Set());
  const [extraJobs, setExtraJobs] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [jobPage, setJobPage] = useState(2);
  const [noMoreJobs, setNoMoreJobs] = useState(false);

  const token = localStorage.getItem('token');

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/resume/more-jobs`,
        { jobTitle: result.jobRole, page: jobPage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        const newJobs = res.data.jobs || [];
        
        const freshJobs = newJobs.filter(job => {
          const key = job.unique_key || `${job.company}-${job.role}`;
          if (seenJobKeys.current.has(key)) return false;
          seenJobKeys.current.add(key);
          return true;
        });
        
        if (freshJobs.length === 0) {
          setNoMoreJobs(true);
        } else {
          setExtraJobs(prev => [...prev, ...freshJobs]);
          setJobPage(prev => prev + 1);
        }
      }
    } catch (err) {
      toast.error('Failed to load more jobs');
      console.error('Load more jobs error:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    if (result?.jobRecommendations?.length) {
      seenJobKeys.current = new Set();
      result.jobRecommendations.forEach(job => {
        const key = job.unique_key || `${job.company}-${job.role}`;
        seenJobKeys.current.add(key);
      });
      setExtraJobs([]);
      setJobPage(2);
      setNoMoreJobs(false);
    }
  }, [result]);

  const getScoreColor = (score) => {
    if (score >= 75) return { text: 'text-green-400', bg: 'bg-green-500', ring: 'ring-green-500' };
    if (score >= 50) return { text: 'text-yellow-400', bg: 'bg-yellow-500', ring: 'ring-yellow-500' };
    return { text: 'text-red-400', bg: 'bg-red-500', ring: 'ring-red-500' };
  };

  const getVerdictBadge = (verdict) => {
    switch (verdict) {
      case 'strong':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'average':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'weak':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const scoreColors = getScoreColor(result.atsScore);
  const circumference = 2 * Math.PI * 80;
  const offset = circumference - (result.atsScore / 100) * circumference;

  return (
    <div ref={resultsRef} className="space-y-8 animate-fade-up">
      {/* Analyze Another Button */}
      <button
        onClick={onAnalyzeAnother}
        className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-lg transition-colors"
      >
        Analyze Another Resume
      </button>

      {/* ATS Score Card */}
      <div className="bg-[#1a1f2e] p-8 rounded-2xl border border-violet-900/30 shadow-[0_0_30px_rgba(124,58,237,0.15)]">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Circular Progress */}
          <div className="relative w-48 h-48">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke="#1f2937"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke={scoreColors.bg}
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-5xl font-bold ${scoreColors.text}`}>
                {result.atsScore}
              </span>
            </div>
          </div>

          {/* Verdict and Summary */}
          <div className="flex-1 text-center md:text-left">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-4 ${getVerdictBadge(result.verdict)}`}>
              <span className="font-semibold capitalize">
                {result.verdict === 'strong' && 'Strong ✅'}
                {result.verdict === 'average' && 'Average ⚠️'}
                {result.verdict === 'weak' && 'Weak ❌'}
              </span>
            </div>
            <p className="text-gray-300 text-lg">{result.summaryFeedback}</p>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses - Two Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-[#1a1f2e] p-6 rounded-2xl border border-violet-900/30 shadow-[0_0_30px_rgba(124,58,237,0.15)]">
          <h3 className="text-xl font-semibold text-white mb-4">Strengths</h3>
          <ul className="space-y-3">
            {result.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-300">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                  <Check className="w-4 h-4 text-violet-400" />
                </div>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-[#1a1f2e] p-6 rounded-2xl border border-violet-900/30 shadow-[0_0_30px_rgba(124,58,237,0.15)]">
          <h3 className="text-xl font-semibold text-white mb-4">Weaknesses</h3>
          <ul className="space-y-3">
            {result.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-300">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                  <X className="w-4 h-4 text-red-400" />
                </div>
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Missing Keywords */}
      <div className="bg-[#1a1f2e] p-6 rounded-2xl border border-violet-900/30 shadow-[0_0_30px_rgba(124,58,237,0.15)]">
        <h3 className="text-xl font-semibold text-white mb-4">Keywords to add to your resume</h3>
        <div className="flex flex-wrap gap-3">
          {result.missingKeywords.map((keyword, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-violet-500/20 text-violet-300 rounded-full text-sm border border-violet-500/30 hover:bg-violet-500/30 transition-colors"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {/* Optimization Suggestions */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Optimization Suggestions</h3>
        {result.suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="bg-[#1a1f2e] p-5 rounded-xl border-l-4 border-violet-500 shadow-[0_0_20px_rgba(124,58,237,0.1)]"
          >
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-semibold">
                {index + 1}
              </span>
              <p className="text-gray-300">{suggestion}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Job Recommendations */}
      {result.jobRecommendations && result.jobRecommendations.length > 0 && (
        <div className="bg-[#1a1f2e] p-6 rounded-2xl border border-violet-900/30 shadow-[0_0_30px_rgba(124,58,237,0.15)]">
          <h3 className="text-2xl font-semibold text-white mb-2 flex items-center gap-2">
            <Rocket className="w-6 h-6 text-violet-400" />
            🇮🇳 Real-Time Job Openings in India Matching Your Profile
          </h3>
          <p className="text-gray-400 mb-6">Showing {result.jobRecommendations.length} live openings</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.jobRecommendations.map((job, index) => {
              const daysAgo = job.postedAt 
                ? Math.floor((Date.now() - new Date(job.postedAt)) / 86400000) 
                : null;
              const postedLabel = daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo} days ago`;

              return (
                <div
                  key={index}
                  className="bg-[#0d1526] border border-violet-900/30 hover:border-violet-500/50 
                          rounded-xl p-5 flex flex-col gap-3 hover:shadow-lg 
                          hover:shadow-violet-900/20 transition-all"
                >
                  {/* Header: logo + company + posted date */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {job.employerLogo ? (
                        <img src={job.employerLogo} alt={job.company} 
                             className="w-8 h-8 rounded object-contain bg-white p-0.5" />
                      ) : (
                        <div className="w-8 h-8 rounded bg-violet-800 flex items-center justify-center 
                                        text-white text-sm font-bold">
                          {job.company[0]}
                        </div>
                      )}
                      <div>
                        <p className="text-white font-semibold text-sm">{job.company}</p>
                        <p className="text-violet-400 text-xs">{job.role}</p>
                      </div>
                    </div>
                    {daysAgo !== null && (
                      <span className="text-gray-600 text-xs">{postedLabel}</span>
                    )}
                  </div>

                  {/* Location */}
                  <p className="text-gray-400 text-sm">📍 {job.location}</p>

                  {/* Match reason / description */}
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                    {job.matchReason}
                  </p>

                  {/* Apply button */}
                  <a href={job.applyUrl} target="_blank" rel="noopener noreferrer"
                     className="mt-auto text-center bg-violet-600 hover:bg-violet-700 
                                text-white text-sm py-2 rounded-lg transition font-medium">
                    Apply Now →
                  </a>
                </div>
              );
            })}
            {extraJobs.map((job, index) => {
              const daysAgo = job.postedAt 
                ? Math.floor((Date.now() - new Date(job.postedAt)) / 86400000) 
                : null;
              const postedLabel = daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo} days ago`;

              return (
                <div
                  key={`extra-${index}`}
                  className="bg-[#0d1526] border border-violet-900/30 hover:border-violet-500/50 
                          rounded-xl p-5 flex flex-col gap-3 hover:shadow-lg 
                          hover:shadow-violet-900/20 transition-all job-card-enter"
                >
                  {/* Header: logo + company + posted date */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {job.employerLogo ? (
                        <img src={job.employerLogo} alt={job.company} 
                             className="w-8 h-8 rounded object-contain bg-white p-0.5" />
                      ) : (
                        <div className="w-8 h-8 rounded bg-violet-800 flex items-center justify-center 
                                        text-white text-sm font-bold">
                          {job.company[0]}
                        </div>
                      )}
                      <div>
                        <p className="text-white font-semibold text-sm">{job.company}</p>
                        <p className="text-violet-400 text-xs">{job.role}</p>
                      </div>
                    </div>
                    {daysAgo !== null && (
                      <span className="text-gray-600 text-xs">{postedLabel}</span>
                    )}
                  </div>

                  {/* Location */}
                  <p className="text-gray-400 text-sm">📍 {job.location}</p>

                  {/* Match reason / description */}
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                    {job.matchReason}
                  </p>

                  {/* Apply button */}
                  <a href={job.applyUrl} target="_blank" rel="noopener noreferrer"
                     className="mt-auto text-center bg-violet-600 hover:bg-violet-700 
                                text-white text-sm py-2 rounded-lg transition font-medium">
                    Apply Now →
                  </a>
                </div>
              );
            })}
          </div>

          {/* Skeleton grid — shows INSTEAD of button while loading */}
          {loadingMore && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[0,1,2,3,4,5].map(i => (
                <div 
                  key={`sk-${i}`} 
                  style={{ 
                    opacity: 0,
                    animation: `cardFadeIn 0.3s ease-out ${i * 80}ms forwards` 
                  }}
                >
                  <JobCardSkeleton />
                </div>
              ))}
            </div>
          )}

          {/* Load More button — only when NOT loading and more jobs exist */}
          {!loadingMore && result.atsScore >= 80 && !noMoreJobs && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleLoadMore}
                className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-lg transition-colors"
              >
                Load More Job Openings
              </button>
            </div>
          )}

          {/* No more jobs message */}
          {noMoreJobs && (
            <p className="text-center text-gray-400 py-4">
              No more jobs found
            </p>
          )}
        </div>
      )}

      {/* No jobs found message */}
      {result.jobRecommendations && result.jobRecommendations.length === 0 && result.atsScore >= 75 && (
        <div className="bg-[#1a1f2e] p-6 rounded-2xl border border-violet-900/30 shadow-[0_0_30px_rgba(124,58,237,0.15)]">
          <p className="text-gray-500 text-sm text-center py-4">
            No live openings found right now. Check back later or search directly on 
            <a href="https://www.naukri.com" target="_blank" className="text-violet-400 ml-1">Naukri</a>,
            <a href="https://www.linkedin.com/jobs" target="_blank" className="text-violet-400 ml-1">LinkedIn</a>
          </p>
        </div>
      )}
    </div>
  );
};

export default ResultsSection;
