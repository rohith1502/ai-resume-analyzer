import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AnalysisHistory = ({ history, loading, onView, onNewAnalysis, onDelete }) => {
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // prevent card click / view opening
    setConfirmDeleteId(id);
  };

  const confirmDelete = async (e, id) => {
    e.stopPropagation();
    setDeletingId(id);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/resume/history/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove from local state instantly
      onDelete(id);
      toast.success('Analysis deleted');
    } catch (err) {
      toast.error('Failed to delete');
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const cancelDelete = (e) => {
    e.stopPropagation();
    setConfirmDeleteId(null);
  };
  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getVerdictBadge = (verdict) => {
    const styles = {
      strong: 'bg-green-900/40 text-green-400 border-green-700',
      average: 'bg-yellow-900/40 text-yellow-400 border-yellow-700',
      weak: 'bg-red-900/40 text-red-400 border-red-700',
    };
    return styles[verdict] || styles.average;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-violet-400 text-4xl animate-pulse">✦</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-violet-300">Your Analyses</h1>
        <button
          onClick={onNewAnalysis}
          className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-lg transition text-sm font-medium"
        >
          + New Analysis
        </button>
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 border border-violet-900/30 rounded-2xl">
          <div className="text-violet-400 text-5xl">✦</div>
          <p className="text-gray-400 text-lg">No analyses yet</p>
          <p className="text-gray-600 text-sm">Upload your resume to get started</p>
          <button
            onClick={onNewAnalysis}
            className="mt-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg transition"
          >
            Analyze Resume
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {history.map((item) => (
            <div
              key={item._id}
              onClick={() => onView(item._id)}
              className="relative bg-[#0d1526] border border-violet-900/30 
                         hover:border-violet-600/60 rounded-xl p-5 cursor-pointer 
                         transition-all hover:shadow-lg hover:shadow-violet-900/20 
                         flex items-center justify-between group"
            >
              {/* Delete button — top right, only visible on hover */}
              {confirmDeleteId !== item._id ? (
                <button
                  onClick={(e) => handleDelete(e, item._id)}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 
                             transition-opacity text-gray-600 hover:text-red-400 
                             p-1 rounded hover:bg-red-900/20"
                  title="Delete analysis"
                >
                  🗑️
                </button>
              ) : (
                /* Confirm delete UI */
                <div
                  className="absolute top-3 right-3 flex items-center gap-2 
                             bg-[#0a0f1e] border border-red-800 rounded-lg px-2 py-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-red-400 text-xs">Delete?</span>
                  <button
                    onClick={(e) => confirmDelete(e, item._id)}
                    disabled={deletingId === item._id}
                    className="text-xs bg-red-600 hover:bg-red-700 text-white 
                               px-2 py-0.5 rounded transition"
                  >
                    {deletingId === item._id ? '...' : 'Yes'}
                  </button>
                  <button
                    onClick={cancelDelete}
                    className="text-xs text-gray-400 hover:text-white px-1"
                  >
                    No
                  </button>
                </div>
              )}

              {/* Existing card content — left side */}
              <div className="flex flex-col gap-1 pr-8">
                <div className="flex items-center gap-3">
                  <span className="text-white font-semibold">{item.jobRole}</span>
                  <span className={`text-xs border px-2 py-0.5 rounded-full capitalize 
                                    ${getVerdictBadge(item.result?.verdict)}`}>
                    {item.result?.verdict || 'N/A'}
                  </span>
                </div>
                <span className="text-gray-500 text-sm">
                  {item.filename} {item.company ? `• ${item.company}` : ''}
                </span>
                <span className="text-gray-600 text-xs">
                  {new Date(item.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </div>

              {/* ATS Score — right side */}
              <div className="flex flex-col items-end gap-1 mr-4">
                <span className={`text-3xl font-bold ${getScoreColor(item.result?.atsScore)}`}>
                  {item.result?.atsScore ?? '--'}
                </span>
                <span className="text-gray-600 text-xs">ATS Score</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalysisHistory;
