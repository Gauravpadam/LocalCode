import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SubmissionItem from './SubmissionItem';
import { getProblemSubmissions } from '../../services/submissionService';
import { dummySolutions } from '../../mockDataForTestingUIs/dummySolutions';

/**
 * SolutionsTab component for displaying submission history
 * 
 * Features:
 * - Fetches and displays user's submissions for a specific problem
 * - Shows submissions in reverse chronological order (newest first)
 * - Displays submission metadata (timestamp, language, status, runtime, memory)
 * - Expandable code view with syntax highlighting
 * - Loading and error states
 * - Empty state when no submissions exist
 */
function SolutionsTab({ problemId }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (import.meta.env.VITE_USE_FAKE_PROBLEMS === 'true') {
      // simulate delay
      const fetchFakeSubmissions = async () => {
        await new Promise((r) => setTimeout(r, 300));
        setSubmissions(dummySolutions);
        setLoading(false);
      };
      fetchFakeSubmissions();
      return;
    }

    const fetchSubmissions = async () => {
      if (!problemId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getProblemSubmissions(problemId);
        
        // Sort submissions by date (newest first)
        const sortedSubmissions = Array.isArray(data) 
          ? [...data].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
          : [];
        
        setSubmissions(sortedSubmissions);
      } catch (err) {
        console.error('Failed to fetch submissions:', err);
        setError('Failed to load submissions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [problemId]);

  // Loading state
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-3 border-primary border-t-transparent rounded-full mb-4"></div>
          <p className="text-slate-400">Loading submissions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
          <svg
            className="w-12 h-12 text-red-400 mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-red-400 font-medium mb-2">Error Loading Submissions</p>
          <p className="text-slate-400 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-md transition-colors text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!submissions || submissions.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 text-slate-600 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-slate-300 mb-2">
            No Submissions Yet
          </h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            You haven&apos;t submitted any solutions for this problem yet. 
            Write your code in the editor and click &quot;Submit&quot; to see your submissions here.
          </p>
        </div>
      </div>
    );
  }

  // Submissions list
  return (
    <div className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-100">
          Your Submissions
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          {submissions.length} submission{submissions.length !== 1 ? 's' : ''} found
        </p>
      </div>

      <div className="space-y-3">
        {submissions.map((submission) => (
          <SubmissionItem key={submission.id} submission={submission} />
        ))}
      </div>
    </div>
  );
}

SolutionsTab.propTypes = {
  problemId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
};

export default SolutionsTab;
