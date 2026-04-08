import PropTypes from 'prop-types';

/**
 * DifficultyBadge component for problem difficulty
 * Displays difficulty level with color coding (Easy/Medium/Hard)
 */
function DifficultyBadge({ difficulty, className = '', outline = false }) {
  const baseStyles = 'px-2 py-1 rounded text-xs font-medium inline-block';
  console.log(difficulty);
  
  // Map difficulty to color schemes
let difficultyStyles;
  if (outline) {

difficultyStyles = {
    'Easy': 'badge badge-success badge-outline',
    'Medium': 'badge badge-warning badge-outline',
    'Hard': 'badge badge-error badge-outline',
  };
  }
  else {
    difficultyStyles = {
    'Easy': 'badge badge-success',
    'Medium': 'badge badge-warning',
    'Hard': 'badge badge-error',
  };
  }

  // Normalize difficulty (case-insensitive)
  const normalizedDifficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
  
  // Default style for unknown difficulties
  const style = difficultyStyles[normalizedDifficulty] || 'badge badge-neutral badge-outline';

  return (
    <span role='button' className={`${baseStyles} ${style} ${className}`}>
      {normalizedDifficulty}
    </span>
  );
}

DifficultyBadge.propTypes = {
  difficulty: PropTypes.string.isRequired,
  className: PropTypes.string,
  outline: PropTypes.bool,
};

export default DifficultyBadge;
