import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';

const FAKE_SUBMISSION_DETAIL = {
  id: 1,
  problemId: 101,
  problemTitle: 'Two Sum',
  language: 'javascript',
  status: 'wrong_answer',
  runtimeMs: 34,
  memoryKb: 20480,
  submittedAt: '2025-01-12T14:32:10Z',
  code: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
}`,
  totalTests: 5,
  passedTests: 3,
  testResults: [
    {
      id: 1,
      passed: true,
      runtimeMs: 5,
      memoryKb: 4096,
      input: 'nums = [2,7,11,15], target = 9',
      expectedOutput: '[0,1]',
      actualOutput: '[0,1]',
    },
    {
      id: 2,
      passed: false,
      runtimeMs: 6,
      memoryKb: 4096,
      input: 'nums = [3,2,4], target = 6',
      expectedOutput: '[1,2]',
      actualOutput: '[0,1]',
    },
    {
      id: 3,
      passed: false,
      errorMessage: 'Wrong Answer on edge case',
      input: 'nums = [3,3], target = 6',
      expectedOutput: '[0,1]',
      actualOutput: '[0,0]',
    },
  ],
};


function SubmissionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    fetchSubmissionDetail();
  }, [id]);

  const fetchSubmissionDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      if (import.meta.env.VITE_USE_FAKE_SUBMISSIONS === 'true') {
      // simulate delay
      await new Promise((r) => setTimeout(r, 300));
      setSubmission({ ...FAKE_SUBMISSION_DETAIL, id });
      return;
    }
      const response = await api.get(API_ENDPOINTS.SUBMISSION_DETAIL(id));
      setSubmission(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load submission details');
      console.error('Error fetching submission details:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'wrong_answer':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'time_limit_exceeded':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'memory_limit_exceeded':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'runtime_error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'compilation_error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatStatus = (status) => {
    return status?.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) || 'Unknown';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(submission.code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleResubmit = () => {
    // Navigate to problem detail page with the code
    navigate(`/problems/${submission.problemId}`, { 
      state: { code: submission.code, language: submission.language } 
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading submission details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card bg-red-50 border border-red-200">
          <p className="text-red-800">{error}</p>
          <div className="flex gap-4 mt-4">
            <button onClick={fetchSubmissionDetail} className="btn-primary">
              Retry
            </button>
            <button onClick={() => navigate('/submissions')} className="btn-secondary">
              Back to History
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!submission) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/submissions')}
          className="text-primary-600 hover:text-primary-700 mb-4 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Submissions
        </button>
        <h1 className="text-3xl text-slate-300 font-bold">Submission Details</h1>
      </div>

      {/* Submission Overview */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl text-slate-300 font-semibold mb-2">{submission.problemTitle}</h2>
            <p className="text-gray-600">Submitted on {formatDate(submission.submittedAt)}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={copyToClipboard}
              className="btn-secondary flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {copySuccess ? 'Copied!' : 'Copy Code'}
            </button>
            <button
              onClick={handleResubmit}
              className="btn-primary flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Resubmit
            </button>
          </div>
        </div>

        {/* Status and Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Status</div>
            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(submission.status)}`}>
              {formatStatus(submission.status)}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Language</div>
            <div className="text-lg font-semibold capitalize">{submission.language}</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Runtime</div>
            <div className="text-lg font-semibold">
              {submission.runtimeMs !== null && submission.runtimeMs !== undefined 
                ? `${submission.runtimeMs}ms` 
                : 'N/A'}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Memory</div>
            <div className="text-lg font-semibold">
              {submission.memoryKb !== null && submission.memoryKb !== undefined 
                ? `${(submission.memoryKb / 1024).toFixed(2)}MB` 
                : 'N/A'}
            </div>
          </div>
        </div>

        {/* Test Results Summary */}
        {submission.totalTests && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm font-medium text-blue-900">
              Test Cases: {submission.passedTests || 0} / {submission.totalTests} Passed
            </div>
            <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${((submission.passedTests || 0) / submission.totalTests) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Code Section */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl text-slate-300 font-semibold">Submitted Code</h3>
          <span className="text-sm text-gray-600 capitalize">{submission.language}</span>
        </div>
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
          <pre className="text-sm font-mono whitespace-pre-wrap break-words">
            <code>{submission.code}</code>
          </pre>
        </div>
      </div>

      {/* Test Results */}
      {submission.testResults && submission.testResults.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Test Case Results</h3>
          <div className="space-y-4">
            {submission.testResults.map((result, index) => (
              <div
                key={result.id || index}
                className={`border rounded-lg p-4 ${
                  result.passed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">Test Case {index + 1}</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      result.passed 
                        ? 'bg-green-200 text-green-800' 
                        : 'bg-red-200 text-red-800'
                    }`}>
                      {result.passed ? 'PASSED' : 'FAILED'}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600">
                    {result.runtimeMs !== null && result.runtimeMs !== undefined && (
                      <span>Runtime: {result.runtimeMs}ms</span>
                    )}
                    {result.memoryKb !== null && result.memoryKb !== undefined && (
                      <span>Memory: {(result.memoryKb / 1024).toFixed(2)}MB</span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Input */}
                  {result.input && (
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Input:</div>
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <pre className="text-sm font-mono whitespace-pre-wrap break-words">{result.input}</pre>
                      </div>
                    </div>
                  )}

                  {/* Expected Output */}
                  {result.expectedOutput && (
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Expected Output:</div>
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <pre className="text-sm font-mono whitespace-pre-wrap break-words">{result.expectedOutput}</pre>
                      </div>
                    </div>
                  )}

                  {/* Actual Output */}
                  {result.actualOutput && (
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Actual Output:</div>
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <pre className="text-sm font-mono whitespace-pre-wrap break-words">{result.actualOutput}</pre>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {result.errorMessage && (
                    <div>
                      <div className="text-sm font-medium text-red-700 mb-1">Error:</div>
                      <div className="bg-white p-3 rounded border border-red-300">
                        <pre className="text-sm font-mono text-red-600 whitespace-pre-wrap break-words">{result.errorMessage}</pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SubmissionDetail;
