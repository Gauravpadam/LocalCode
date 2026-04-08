import PropTypes from 'prop-types';

/**
 * StatusBadge component for submission status
 * Displays status with appropriate color coding
 */
function StatusBadge({ status, className = '', outline = false }) {
  const baseStyles = 'px-2 py-1 rounded text-xs font-medium inline-block';
  
  // Convert enum status to display string
  const getDisplayStatus = (status) => {
    if (!status) return 'Unknown';
    
    // Handle enum object or string enum value
    const statusStr = typeof status === 'object' ? status.toString() : status;
    
    // Convert SNAKE_CASE to Title Case
    return statusStr
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const displayStatus = getDisplayStatus(status);
  const statusKey = typeof status === 'object' ? status.toString() : status;
  


  // Define the daisyUI badge class mappings
let statusStyles;

  if (outline) {
    statusStyles = {
    // Green (Success)
    'ACCEPTED': 'badge badge-success badge-outline',
    'Accepted': 'badge badge-success badge-outline',

    // Red (Error)
    'WRONG_ANSWER': 'badge badge-error badge-outline',
    'Wrong Answer': 'badge badge-error badge-outline',
    'RUNTIME_ERROR': 'badge badge-error badge-outline',
    'Runtime Error': 'badge badge-error badge-outline',
    'COMPILATION_ERROR': 'badge badge-error badge-outline',
    'Compilation Error': 'badge badge-error badge-outline',

    // Amber (Warning)
    'TIME_LIMIT_EXCEEDED': 'badge badge-warning badge-outline',
    'Time Limit Exceeded': 'badge badge-warning badge-outline',
    'MEMORY_LIMIT_EXCEEDED': 'badge badge-warning badge-outline',
    'Memory Limit Exceeded': 'badge badge-warning badge-outline',

    // Blue (Info)
    'RUNNING': 'badge badge-info badge-outline',
    'Running': 'badge badge-info badge-outline',
    'JUDGING': 'badge badge-info badge-outline',
    'Judging': 'badge badge-info badge-outline',

    // Neutral/Slate
    'PENDING': 'badge badge-neutral badge-outline',
    'Pending': 'badge badge-neutral badge-outline',
  };  } else {

    statusStyles = {
    // Green (Success)
    'ACCEPTED': 'badge badge-success',
    'Accepted': 'badge badge-success',

    // Red (Error)
    'WRONG_ANSWER': 'badge badge-error',
    'Wrong Answer': 'badge badge-error',
    'RUNTIME_ERROR': 'badge badge-error',
    'Runtime Error': 'badge badge-error',
    'COMPILATION_ERROR': 'badge badge-error',
    'Compilation Error': 'badge badge-error',

    // Amber (Warning)
    'TIME_LIMIT_EXCEEDED': 'badge badge-warning',
    'Time Limit Exceeded': 'badge badge-warning',
    'MEMORY_LIMIT_EXCEEDED': 'badge badge-warning',
    'Memory Limit Exceeded': 'badge badge-warning',

    // Blue (Info)
    'RUNNING': 'badge badge-info',
    'Running': 'badge badge-info',
    'JUDGING': 'badge badge-info',
    'Judging': 'badge badge-info',

    // Neutral/Slate
    'PENDING': 'badge badge-neutral',
    'Pending': 'badge badge-neutral',
  };  }


  // Default style for unknown statuses
  const style = statusStyles[statusKey] || statusStyles[displayStatus] || 'badge badge-neutral badge-outline';

  return (
    <span className={`${baseStyles} ${style} ${className}`}>
      {displayStatus}
    </span>
  );
}

StatusBadge.propTypes = {
  status: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  className: PropTypes.string,
};

export default StatusBadge;
