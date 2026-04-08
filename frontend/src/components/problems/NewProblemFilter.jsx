import PropTypes from "prop-types";

/**
 * ProblemFilters component
 * DaisyUI filter utilities version
 * Logic unchanged, UI refactored
 */
function NewProblemFilters({
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
    { value: "unsolved", label: "Unsolved" },
  ];

  const hasActiveFilters =
    difficulty !== "all" || status !== "all" || tags.length > 0;

  return (
    <div className={`flex flex-col gap-3${className}`}>
      {/* ================= Difficulty ================= */}
      <div className="space-y-2">
        <label className="label">
          <span className="label-text">Difficulty</span>
        </label>

        <form className="flex flex-wrap gap-2">
          {difficulties.map((diff) => (
            <input
              key={diff}
              type="checkbox"
              className="btn btn-sm"
              aria-label={diff}
              checked={difficulty === diff}
              onChange={() => onDifficultyChange(diff)}
            />
          ))}
        </form>
      </div>

      {/* ================= Status ================= */}
      <div className="space-y-2">
        <label className="label">
          <span className="label-text">Status</span>
        </label>

        <form className="flex flex-wrap gap-2">
          {statuses.map((stat) => (
            <input
              key={stat.value}
              type="checkbox"
              className="btn btn-sm"
              aria-label={stat.label}
              checked={status === stat.value}
              onChange={() => onStatusChange(stat.value)}
            />
          ))}
        </form>
      </div>

      {/* ================= Tags ================= */}
      {availableTags.length > 0 && (
        <div className="space-y-2">
          <label className="label">
            <span className="label-text">Tags</span>
          </label>

          <form className="flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const isActive = tags.includes(tag);

              return (
                <input
                  key={tag}
                  type="checkbox"
                  className="btn btn-sm"
                  aria-label={tag}
                  checked={isActive}
                  onChange={() =>
                    isActive
                      ? onTagsChange(tags.filter((t) => t !== tag))
                      : onTagsChange([...tags, tag])
                  }
                />
              );
            })}

            {hasActiveFilters && (
              <input
                type="reset"
                value="×"
                className="btn btn-sm btn-square"
                onClick={() => {
                  onDifficultyChange("all");
                  onStatusChange("all");
                  onTagsChange([]);
                }}
              />
            )}
          </form>
        </div>
      )}

      {/* ================= Active Filter Summary ================= */}
      {hasActiveFilters && (
        <>
          <div className="divider" />

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
              className="btn btn-link btn-sm text-warning"
              onClick={() => {
                onDifficultyChange("all");
                onStatusChange("all");
                onTagsChange([]);
              }}
            >
              Clear all
            </button>
          </div>
        </>
      )}
    </div>
  );
}

NewProblemFilters.propTypes = {
  difficulty: PropTypes.string.isRequired,
  onDifficultyChange: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  tags: PropTypes.array.isRequired,
  onTagsChange: PropTypes.func.isRequired,
  availableTags: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
};

export default NewProblemFilters;
