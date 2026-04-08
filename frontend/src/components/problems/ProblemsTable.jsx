import PropTypes from "prop-types";
import ProblemRow from "./ProblemRow";

/**
 * ProblemsTable component (DaisyUI)
 */
function ProblemsTable({
  problems,
  sortBy,
  onSortChange,
  loading = false,
  className = "",
}) {
  const columns = [
    { key: "status", label: "Status", sortable: false },
    { key: "title", label: "Title", sortable: true },
    { key: "difficulty", label: "Difficulty", sortable: true },
    { key: "tags", label: "Tags", sortable: false },
  ];

  const handleSort = (columnKey) => {
    onSortChange(columnKey === sortBy ? null : columnKey);
  };

  const getSortIcon = (columnKey) => {
    if (sortBy !== columnKey) {
      return (
        <svg
          className="w-4 h-4 opacity-60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }
    return (
      <svg
        className="w-4 h-4 text-warning"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 15l7-7 7 7"
        />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <span className="loading loading-spinner loading-md" />
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div className="alert alert-info">
        <span>No problems found matching your filters.</span>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <div className="card bg-base-100 border border-base-300">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr>
              {columns.map((column) => (
                <th key={column.key}>
                  {column.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(column.key)}
                      className="btn btn-ghost btn-xs gap-1"
                      aria-label={`Sort by ${column.label}`}
                    >
                      {column.label}
                      {getSortIcon(column.key)}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <ProblemRow key={problem.id} problem={problem} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

ProblemsTable.propTypes = {
  problems: PropTypes.array.isRequired,
  sortBy: PropTypes.string,
  onSortChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  className: PropTypes.string,
};

export default ProblemsTable;
