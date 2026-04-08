import PropTypes from "prop-types";

/**
 * Generic Table Component
 *
 * columns: [
 *   { key: "title", label: "Title", sortable: true, render: (row) => <CustomComponent /> },
 *   { key: "status", label: "Status", sortable: false }
 * ]
 *
 * data: array of objects
 * onSortChange: function(columnKey)
 * rowClick: optional function(row)
 */
// eslint-disable-next-line no-unused-vars
function Table({
  columns,
  className = "",
  onSortChange,
  sortBy,
  rowClick,
  sortOrder,
  rowData,
  loading = false,
}) {
  const handleSort = (columnKey) => {
    if (!onSortChange) return;

    if (columnKey !== sortBy) {
      // new column → default asc
      onSortChange(columnKey, "asc");
    } else {
      // same column → toggle direction
      onSortChange(columnKey, sortOrder === "asc" ? "desc" : "asc");
    }
  };

  const getSortIcon = (columnKey) => {
    if (sortBy !== columnKey) {
      // neutral icon
      return (
        <svg
          className="w-4 h-4 opacity-40 ml-1"
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

    // active column → direction matters
    return sortOrder === "asc" ? (
      <svg
        className="w-4 h-4 text-primary ml-1"
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
    ) : (
      <svg
        className="w-4 h-4 text-primary ml-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 9l-7 7-7-7"
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

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="table table-zebra w-full border border-base-300 rounded-lg">
        <thead className="bg-base-200 sticky top-0 z-20">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-left font-semibold">
                {col.sortable ? (
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs gap-1"
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label}
                    {getSortIcon(col.key)}
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-6 opacity-50"
              >
                No data available.
              </td>
            </tr>
          ) : (
            rowData.map((row, idx) => (
              <tr
                key={idx}
                onClick={rowClick ? () => rowClick(row) : undefined}
                className={
                  rowClick
                    ? "cursor-pointer hover:bg-base-300 transition-colors"
                    : ""
                }
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      render: PropTypes.func,
    })
  ).isRequired,

  rowData: PropTypes.arrayOf(PropTypes.object).isRequired,
  sortOrder: PropTypes.oneOf(["asc", "desc"]),
  className: PropTypes.string,
  onSortChange: PropTypes.func,
  sortBy: PropTypes.string, // can be null
  rowClick: PropTypes.func,
  loading: PropTypes.bool,
};

export default Table;
