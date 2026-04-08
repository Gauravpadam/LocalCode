import PropTypes from "prop-types";

/**
 * ProblemFilters component (DaisyUI version)
 * Uses DaisyUI buttons, groups, and theme colors
 */
function ProblemFilters({
  difficulty,
  onDifficultyChange,
  status,
  onStatusChange,
  tags,
  onTagsChange,
  availableTags = [],
  className = "",
}) {
  const difficulties = ["all", "easy", "medium", "hard"];
  const statuses = [
    { value: "all", label: "All" },
    { value: "solved", label: "Solved" },
    { value: "attempted", label: "Attempted" },
    { value: "not_attempted", label: "Unsolved" },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Difficulty */}
      <div>
        <label className="label">
          <span className="label-text">Difficulty</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {difficulties.map((diff) => {
            const isActive = difficulty === diff;
            return (
              <button
                key={diff}
                type="button"
                aria-pressed={isActive}
                onClick={() => onDifficultyChange(diff)}
                className={`btn btn-sm ${
                  isActive ? "btn-warning" : "btn-outline"
                }`}
              >
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="label">
          <span className="label-text">Status</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {statuses.map((stat) => {
            const isActive = status === stat.value;
            return (
              <button
                key={stat.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => onStatusChange(stat.value)}
                className={`btn btn-sm ${
                  isActive ? "btn-warning" : "btn-outline"
                }`}
              >
                {stat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tags */}
      {availableTags.length > 0 && (
        <div>
          <label className="label">
            <span className="label-text">Tags</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const isActive = tags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() =>
                    isActive
                      ? onTagsChange(tags.filter((t) => t !== tag))
                      : onTagsChange([...tags, tag])
                  }
                  className={`btn btn-sm ${
                    isActive ? "btn-warning" : "btn-outline"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active filters summary */}
      {(difficulty !== "all" || status !== "all" || tags.length > 0) && (
        <div className="divider" />

      )}
      {(difficulty !== "all" || status !== "all" || tags.length > 0) && (
        <div className="flex items-center justify-between text-sm">
          <span className="opacity-70">
            {[
              difficulty !== "all" && `Difficulty: ${difficulty}`,
              status !== "all" && `Status: ${status}`,
              tags.length > 0 && `Tags: ${tags.length}`,
            ]
              .filter(Boolean)
              .join(" • ")}
          </span>
          <button
            type="button"
            onClick={() => {
              onDifficultyChange("all");
              onStatusChange("all");
              onTagsChange([]);
            }}
            className="btn btn-link btn-sm text-warning"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

ProblemFilters.propTypes = {
  difficulty: PropTypes.string.isRequired,
  onDifficultyChange: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  tags: PropTypes.array.isRequired,
  onTagsChange: PropTypes.func.isRequired,
  availableTags: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
};

export default ProblemFilters;
