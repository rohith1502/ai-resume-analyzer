import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import ResumeAnalyzerForm from '../components/ResumeAnalyzerForm';
import ResultsSection from '../components/ResultsSection';
import AnalysisHistory from '../components/AnalysisHistory';

const DashboardPage = () => {
  const [view, setView] = useState('history'); // 'history' | 'form' | 'results'
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const { user, logout } = useAuth();
  const token = localStorage.getItem('token');

  // Get user display name: prefer name, then email (without @domain), fallback to 'User'
  const userDisplay = (() => {
    if (!user) return 'User';
    if (user.name) return user.name;
    if (user.email) return user.email.split('@')[0];
    return 'User';
  })();

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/resume/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setHistory(res.data.data);
    } catch (err) {
      console.error('History fetch error:', err.message);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleAnalyze = async (formData) => {
    setLoading(true);
    setView('results');
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/resume/analyze`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );
      if (response.data.success) {
        toast.success('Resume analyzed successfully!');
        setResult(response.data.data);
        fetchHistory(); // refresh history after new analysis
      } else {
        toast.error(response.data.message || 'Analysis failed');
        setView('form');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to analyze resume');
      setView('form');
    } finally {
      setLoading(false);
    }
  };

  const handleViewHistory = async (id) => {
    setLoading(true);
    setView('results');
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/resume/history/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setResult(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load analysis');
      setView('history');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleDelete = (deletedId) => {
    setHistory((prev) => prev.filter((item) => item._id !== deletedId));
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-violet-900/30 sticky top-0 bg-[#0a0f1e] z-10">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('history')}>
          <span className="text-violet-400 text-2xl">✦</span>
          <span className="text-violet-300 font-bold text-xl">Resume Analyzer</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm hidden md:block">{userDisplay}</span>
          {view !== 'form' && (
            <button
              onClick={() => { setResult(null); setView('form'); }}
              className="text-sm bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition"
            >
              + New Analysis
            </button>
          )}
          <button
            onClick={handleLogout}
            className="text-sm text-violet-400 border border-violet-700 px-3 py-2 rounded-lg hover:bg-violet-900/30 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-10">

        {/* HISTORY VIEW */}
        {view === 'history' && (
          <AnalysisHistory
            history={history}
            loading={historyLoading}
            onView={handleViewHistory}
            onNewAnalysis={() => setView('form')}
            onDelete={handleDelete}
          />
        )}

        {/* FORM VIEW */}
        {view === 'form' && (
          <>
            <button
              onClick={() => setView('history')}
              className="text-violet-400 text-sm mb-6 flex items-center gap-1 hover:text-violet-300"
            >
              ← Back to Dashboard
            </button>
            <ResumeAnalyzerForm onSubmit={handleAnalyze} />
          </>
        )}

        {/* RESULTS VIEW */}
        {view === 'results' && (
          <>
            <button
              onClick={() => { setResult(null); setView('history'); }}
              className="text-violet-400 text-sm mb-6 flex items-center gap-1 hover:text-violet-300"
            >
              ← Back to Dashboard
            </button>
            {loading && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="text-violet-400 text-5xl animate-pulse">✦</div>
                <p className="text-violet-300 text-lg">Analyzing your resume with AI...</p>
                <p className="text-gray-500 text-sm">This may take a moment</p>
              </div>
            )}
            {!loading && result && (
              <ResultsSection
                result={result}
                onAnalyzeAnother={() => { setResult(null); setView('form'); }}
              />
            )}
          </>
        )}

      </main>
    </div>
  );
};

export default DashboardPage;
