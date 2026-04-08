import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';

/**
 * RecentSubmissions component converted to daisyUI
 */
function RecentSubmissions({ submissions = [], loading = false }) {
  // Loading State with daisyUI Spinner
  if (loading) {
    return (
      <Card className="">
        <h2 className="card-title text-2xl mb-6">Recent Submissions</h2>
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <span className="loading loading-ring loading-lg text-primary"></span>
          <span className="text-base-content/60">Loading submissions...</span>
        </div>
      </Card>
    );
  }

  // Empty State
  if (!submissions || submissions.length === 0) {
    return (
      <Card className="">
        <h2 className="card-title text-2xl mb-6">Recent Submissions</h2>
        <div className="text-center py-8">
          <p className="text-base-content mb-6">No submissions yet. Start solving problems to see your progress!</p>
          <Link to="/problems" className="btn btn-primary ">
            Browse Problems
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="">
      <h2 className="card-title text-2xl mb-6 ">
        Recent Submissions
      </h2>
      
      <div className="flex flex-col gap-3">
        {submissions.map((submission) => (
          <Link
            key={submission.id}
            to={`/submissions/${submission.id}`}
            className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-base-100 border border-base-300 hover:bg-secondary transition-all duration-200 shadow-sm"
          >
            <div className="flex-1">
              <h3 className="font-bold text-lg group-hover:text-black transition-colors">
                {submission.problemTitle || `Problem #${submission.problemId}`}
              </h3>
              
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="badge  badge-sm badge-outline font-mono opacity-70">
                  {submission.language}
                </span>
                <span className="text-xs opacity-50">•</span>
                <span className="text-xs font-medium opacity-60">
                  {new Date(submission.submittedAt).toLocaleDateString(undefined, { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
                
                {submission.runtimeMs && (
                  <>
                    <span className="text-xs opacity-50">•</span>
                    <span className="text-xs font-medium opacity-60">{submission.runtimeMs}ms</span>
                  </>
                )}
              </div>
            </div>

            <div className="mt-3 sm:mt-0">
              <StatusBadge status={submission.status} />
            </div>
          </Link>
        ))}
      </div>

      {submissions.length >= 5 && (
        <div className="card-actions justify-center mt-8">
          <Link to="/submissions" className="btn btn-ghost btn-sm text-primary gap-2">
            View All Submissions
            <span>→</span>
          </Link>
        </div>
      )}
    </Card>
  );
}

RecentSubmissions.propTypes = {
  submissions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      problemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      problemTitle: PropTypes.string,
      status: PropTypes.string.isRequired,
      language: PropTypes.string.isRequired,
      submittedAt: PropTypes.string.isRequired,
      runtimeMs: PropTypes.number,
    })
  ),
  loading: PropTypes.bool,
};

export default RecentSubmissions;