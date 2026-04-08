import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import DifficultyBadge from "../common/DifficultyBadge";

/**
 * ProblemRow component (DaisyUI)
 */
function ProblemRow({ problem }) {
  const navigate = useNavigate();

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "solved":
        return (
          <span className="text-success" title="Solved">
            ✓
          </span>
        );
      case "attempted":
        return (
          <span className="text-warning" title="Attempted">
            ▶
          </span>
        );
      default:
        return (
          <span className="opacity-40" title="Not Attempted">
            ○
          </span>
        );
    }
  };

  const handleClick = () => {
    navigate(`/problems/${problem.id}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <tr
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyPress}
      className="hover:bg-secondary cursor-pointer focus:outline-none active"
      aria-label={`View problem: ${problem.title}`}
    >
      {/* Status */}
      <td className="text-center">{getStatusIcon(problem.userStatus)}</td>

      {/* Title */}
      <td className="font-medium text-secondary hover:text-secondary-content transition-colors">
        {problem.title}
      </td>

      {/* Difficulty */}
      <td>
        <DifficultyBadge difficulty={problem.difficulty} outline={true} />
      </td>

      {/* Tags */}
      <td>
        {problem.tags?.length ? (
          <div className="flex flex-wrap gap-1">
            {problem.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="badge badge-outline badge-sm">
                {tag}
              </span>
            ))}
            {problem.tags.length > 3 && (
              <span className="badge badge-ghost badge-sm">
                +{problem.tags.length - 3}
              </span>
            )}
          </div>
        ) : (
          <span className="opacity-50">—</span>
        )}
      </td>

      {/* Optional acceptance rate */}
      {problem.acceptanceRate !== undefined && (
        <td className="text-sm opacity-70">
          {problem.acceptanceRate}%
        </td>
      )}
    </tr>
  );
}

ProblemRow.propTypes = {
  problem: PropTypes.object.isRequired,
};

export default ProblemRow;
