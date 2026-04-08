import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import ProblemLayout from '../components/problem-detail/ProblemLayout';
import ProblemDescription from '../components/problem-detail/ProblemDescription';
import CodeEditor from '../components/problem-detail/CodeEditor';
import LanguageSelector from '../components/problem-detail/LanguageSelector';
import TestCasePanel from '../components/problem-detail/TestCasePanel';
import SolutionsTab from '../components/problem-detail/SolutionsTab';
import { dummyProblem } from '../mockDataForTestingUIs/dummyProblem';
import { dummyTestCases } from '../mockDataForTestingUIs/dummyTestCases';

function ProblemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State management
  const [problem, setProblem] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('java');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [submissionId, setSubmissionId] = useState(null);
  const [toggleViewAllResults, setToggleViewAllResults] = useState(false);

  // Get active tab from URL query params
  const activeTab = searchParams.get('tab') || 'description';

  // Fetch problem details and test cases on mount
  useEffect(() => {
    console.log('USE_FAKE_PROBLEM_Details:', import.meta.env.VITE_USE_FAKE_PROBLEMS);
    fetchProblemDetails();
    fetchTestCases();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Load and save code from/to localStorage
  useEffect(() => {
    const savedCode = localStorage.getItem(`problem_${id}_${selectedLanguage}`);
    if (savedCode && savedCode.trim() != '') {
      setCode(savedCode);
    } else if (problem) {
      loadStarterCode();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage, problem, id]);

  useEffect(() => {
    if (code && problem) {
      localStorage.setItem(`problem_${id}_${selectedLanguage}`, code);
    }
  }, [code, id, selectedLanguage, problem]);

  // Polling for submission response
  useEffect(()=>{
    if (!submissionId) return;

    let cancelled = false;

    const pollSubmission = async () => {
      try{
        const res = await api.get(API_ENDPOINTS.SUBMISSION_DETAIL(submissionId));

        if (cancelled) return;

        const data = res.data; 

        setSubmissionResult(data);
        
        if (data.status !== 'PENDING'){
          if (data.testResults){  
            const formattedResults = data.testResults.map(tr => ({
              testCaseId: tr.testCaseId,
              passed: tr.passed,
              input: tr.input,
              actual: tr.actualOutput,
              expected: tr.expectedOutput,
              error: tr.errorMessage,
              runtime: tr.runtimeMs,
              testCaseId: tr.testCaseId
            }));
            setTestResults(formattedResults);
            setToggleViewAllResults(true);
          }

          setSubmitting(false);
          return;

        }

        setTimeout(pollSubmission, 1500);
      } catch (e) {
          console.error('Polling Failed', e);
          setTimeout(pollSubmission, 3000);
        }
    };

    pollSubmission();

    return () => {
      cancelled = true;
    };
  }, [submissionId]);

  // Fetch problem details from API
  const fetchProblemDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      if(import.meta.env.VITE_USE_FAKE_PROBLEMS === 'true') {
        // simulate delay
        await new Promise((r) => setTimeout(r, 300));
        setProblem(dummyProblem);
        loadStarterCodeFromProblem(dummyProblem);
        return;
      }
      const response = await api.get(API_ENDPOINTS.PROBLEM_DETAIL(id));
      setProblem(response.data);
      loadStarterCodeFromProblem(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load problem details');
      console.error('Error fetching problem:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch test cases from API
  const fetchTestCases = async () => {
    try {
      if(import.meta.env.VITE_USE_FAKE_PROBLEM === 'true') {
        // simulate delay
        await new Promise((r) => setTimeout(r, 300));
        setTestCases(dummyTestCases);
        return;
      }
      const response = await api.get(API_ENDPOINTS.PROBLEM_TESTCASES(id));
      setTestCases(response.data);
    } catch (err) {
      console.error('Error fetching test cases:', err);
    }
  };

  // Load starter code from problem data
  const loadStarterCodeFromProblem = (problemData) => {
    const savedCode = localStorage.getItem(`problem_${id}_${selectedLanguage}`);
    if (!savedCode) {
      const starterCode = getStarterCode(problemData, selectedLanguage);
      setCode(starterCode);
    }
  };

  // Load starter code for current language
  const loadStarterCode = () => {
    if (problem) {
      const starterCode = getStarterCode(problem, selectedLanguage);
      setCode(starterCode);
    }
  };

  // Get starter code based on language
  const getStarterCode = (problemData, language) => {
    console.log(problemData);
    
    switch (language) {
      case 'java':
        return problemData.starterCode.java || '// Write your Java code here\n';
      case 'python':
        return problemData.starterCode.python || '# Write your Python code here\n';
      case 'javascript':
        return problemData.starterCode.javascript || '// Write your JavaScript code here\n';
      default:
        return '';
    }
  };

  // Handle language change
  const handleLanguageChange = (newLanguage) => {
    setSelectedLanguage(newLanguage);
    setSubmissionResult(null);
    setTestResults(null);
  };

  // Handle tab change via URL query params
  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  // Handle code submission
  const handleSubmit = async () => {
    if (!code.trim()) {
      alert('Please write some code before submitting');
      return;
    }

    try {
      setSubmitting(true);
      setToggleViewAllResults(false);
      setSubmissionResult([]);
      setTestResults([]);
      
      const response = await api.post(API_ENDPOINTS.SUBMISSIONS, {
        problemId: parseInt(id),
        code: code,
        language: selectedLanguage
      });

      setSubmissionId(response.data.id);
      setSubmissionResult({status: response.data.status});
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit solution');
      console.error('Error submitting solution:', err);
    }
  };

  // Handle code run (test against sample test cases only - no submission created)
  const handleRun = async () => {
    if (!code.trim()) {
      alert('Please write some code before running');
      return;
    }

    try {
      setRunning(true);
      setToggleViewAllResults(false);
      setTestResults([]);
      setSubmissionResult(null);  // Clear any previous submission result
      
      // Use the /run endpoint - tests against sample cases only, no submission created
      const response = await api.post(API_ENDPOINTS.SUBMISSIONS_RUN, {
        problemId: parseInt(id),
        code: code,
        language: selectedLanguage
      });

      console.log(response.data);
      

      // Convert test results to TestResults component format
      if (response.data.testResults) {
        const formattedResults = response.data.testResults.map(tr => ({
          testCaseId: tr.testCaseId,
          passed: tr.passed,
          input: tr.input,
          expected: tr.expectedOutput,
          actual: tr.actualOutput,
          error: tr.errorMessage,
          runtime: tr.runtimeMs,
        }));
        setTestResults(formattedResults);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to run code');
      console.error('Error running code:', err);
    } finally {
      setRunning(false);
    }
  };

  // Get difficulty badge color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-emerald-900/30 text-emerald-400 border border-emerald-700';
      case 'medium':
        return 'bg-amber-900/30 text-amber-400 border border-amber-700';
      case 'hard':
        return 'bg-red-900/30 text-red-400 border border-red-700';
      default:
        return 'bg-slate-800 text-slate-400 border border-slate-700';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-lg text-slate-400">Loading problem...</div>
      </div>
    );
  }

  // Error state
  if (error && !problem) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-6">
            <p className="text-red-400">{error}</p>
            <button onClick={() => navigate('/problems')} className="btn-primary mt-4">
              Back to Problems
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render left pane with ProblemDescription component
  const renderLeftPane = () => {
    // Create tab content based on active tab
    const tabContent = {
      description: null, // ProblemDescription handles this internally
      solutions: <SolutionsTab problemId={id} />,
      submissions: <SolutionsTab problemId={id} />, // Same as solutions for now
    };

    return (
      <ProblemDescription
        problem={problem}
        testCases={testCases}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        solutionsTab={tabContent.solutions}
        submissionsTab={tabContent.submissions}
      />
    );
  };

  // Render right pane with CodeEditor and TestCasePanel
  const renderRightPane = () => {
    // Get sample test cases only
    const sampleTestCases = testCases.filter(tc => tc.isSample);
    
    return (
      <div className="flex flex-col h-full bg-slate-850">
        {/* Editor header with language selector */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700 bg-slate-800">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
          />
        </div>

        {/* Code Editor - takes upper portion */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <CodeEditor
            language={selectedLanguage}
            value={code}
            onChange={setCode}
            height="100%"
          />
        </div>

        {/* Test Case Panel - takes lower portion (fixed height) */}
        <div className="h-64 min-h-[200px] max-h-[300px]">
          <TestCasePanel
            sampleTestCases={sampleTestCases}
            testResults={testResults}
            isRunning={running}
            isSubmitting={submitting}
            onRun={handleRun}
            onSubmit={handleSubmit}
            toggleViewAllResults={toggleViewAllResults}
          />
        </div>

        {/* Submission Result Summary (shown after submit) */}
        {!toggleViewAllResults && submissionResult && (
          <div className="border-t border-slate-700 bg-slate-800 px-4 py-3">
            <div className="flex items-center justify-between text-sm">
              <span className={`font-semibold ${
                submissionResult.status === 'ACCEPTED' 
                  ? 'text-emerald-400' 
                  : 'text-red-400'
              }`}>
                {submissionResult.status?.replace(/_/g, ' ')}
              </span>
              <div className="flex items-center gap-4 text-slate-400">
                {submissionResult.runtimeMs !== null && (
                  <span>Runtime: {submissionResult.runtimeMs}ms</span>
                )}
                {submissionResult.memoryKb !== null && (
                  <span>Memory: {(submissionResult.memoryKb / 1024).toFixed(2)}MB</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="bg-slate-850 border-b border-slate-700 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/problems')}
              className="text-slate-400 hover:text-primary transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-xl font-bold text-slate-50">{problem?.title}</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(problem?.difficulty)}`}>
              {problem?.difficulty}
            </span>
          </div>
        </div>
      </div>

      {/* Split Layout */}
      <div className="flex-1 overflow-hidden">
        <ProblemLayout
          problemId={id}
          leftPane={renderLeftPane()}
          rightPane={renderRightPane()}
        />
      </div>
    </div>
  );
}

export default ProblemDetail;
