import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../contexts/AuthContext";
import { API_ENDPOINTS } from "../config/api";
import SearchBar from "../components/problems/SearchBar";
import Card from "../components/common/Card";
import Table from "../components/Table";
import DifficultyBadge from "../components/common/DifficultyBadge";
import NewProblemFilters from "../components/problems/NewProblemFilter";

// Add this at the top of your file (before the component)
// eslint-disable-next-line no-unused-vars
function formatDate(dateString) {
  if (!dateString) return "--";

  const date = new Date(dateString);

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const MOCK_PROBLEMS = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "EASY",
    tags: ["array", "hashmap"],
    userStatus: "solved",
    acceptanceRate: 45,
  },
  {
    id: 2,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "MEDIUM",
    tags: ["string", "sliding-window"],
    userStatus: "attempted",
    acceptanceRate: 32,
  },
  {
    id: 3,
    title: "Median of Two Sorted Arrays",
    difficulty: "HARD",
    tags: ["array", "binary-search"],
    userStatus: "unsolved",
    acceptanceRate: 18,
  },
];

function ProblemList() {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states - initialize from URL params
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [difficultyFilter, setDifficultyFilter] = useState(
    searchParams.get("difficulty") || "all"
  );
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "all"
  );
  const [tags, setTags] = useState(
    searchParams.get("tags")?.split(",").filter(Boolean) || []
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || null);
  const [sortOrder, setSortOrder] = useState("asc");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1", 10)
  );
  // eslint-disable-next-line no-unused-vars
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  // Sync filters with URL query parameters
  useEffect(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (difficultyFilter !== "all") params.difficulty = difficultyFilter;
    if (statusFilter !== "all") params.status = statusFilter;
    if (tags.length > 0) params.tags = tags.join(",");
    if (sortBy) params.sort = sortBy;
    if (currentPage > 1) params.page = currentPage.toString();

    setSearchParams(params, { replace: true });
  }, [
    searchTerm,
    difficultyFilter,
    statusFilter,
    tags,
    sortBy,
    currentPage,
    setSearchParams,
  ]);

  useEffect(() => {
    fetchProblems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficultyFilter, tags, searchTerm]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      setError(null);

      if (import.meta.env.VITE_USE_FAKE_PROBLEMS === "true") {
        // simulate network delay
        await new Promise((r) => setTimeout(r, 300));

        setProblems(MOCK_PROBLEMS);
        setTotalPages(1);
        return;
      }

      // Build query parameters for API
      const params = new URLSearchParams();
      if (difficultyFilter !== "all")
        params.append("difficulty", difficultyFilter.toUpperCase());
      if (tags.length > 0) params.append("tags", tags.join(","));
      if (searchTerm) params.append("search", searchTerm);
      // Note: Backend doesn't support pagination yet, so we skip page/size params

      const url = `${API_ENDPOINTS.PROBLEMS}${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      const response = await api.get(url);

      // Backend returns array of problems with userStatus field
      setProblems(Array.isArray(response.data) ? response.data : []);
      setTotalPages(1); // No pagination yet
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load problems");
      console.error("Error fetching problems:", err);
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering for status (backend returns userStatus in each problem)
  const filteredProblems = problems.filter((problem) => {
    const matchesStatus =
      statusFilter === "all" || problem.userStatus === statusFilter;
    return matchesStatus;
  });

  // Extract available tags from problems
  const availableTags = [
    ...new Set(problems.flatMap((p) => p.tags || [])),
  ].sort();

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page
  };

  const handleDifficultyChange = (value) => {
    setDifficultyFilter(value);
    setCurrentPage(1); // Reset to first page
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleTagsChange = (value) => {
    setTags(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value, order) => {
    setSortBy(value);
    setCurrentPage(1);
    setSortOrder(order);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sortedProblems = [...filteredProblems].sort((a, b) => {
  if (!sortBy) return 0;

  switch (sortBy) {
    case "title":
      return a.title.localeCompare(b.title);

    case "difficulty":
      return a.difficulty.localeCompare(b.difficulty);

    case "acceptanceRate":
      return (a.acceptanceRate ?? 0) - (b.acceptanceRate ?? 0);

    default:
      return 0;
  }
});


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col justify-center items-center h-64">
            <div className="text-lg text-slate-400">Loading problems</div>
            <span className="loading loading-dots text-primary-content loading-lg"></span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="alert alert-error shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
          <button
            onClick={fetchProblems}
            className="btn btn-sm btn-ghost bg-black/10"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 py-10 px-4">
      <div className="card card-body card-border bg-base-200 border border-base-300 card-lg max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       <div className="card border border-base-300 card-body bg-base-300/50 flex lg:flex-row items-center justify-between mb-6">
         {/* Page Header */}
        <h1 className="card-title text-3xl font-bold text-base-content ">
          Problems
        </h1>

        {/* Search Bar */}
        <SearchBar
          value={searchTerm}
          onChange={handleSearchChange}
          className=""
        />
       </div>

       <div className="card card-body bg-base-300/50 flex flex-col ">
         {/* Filters */}
          <NewProblemFilters
            difficulty={difficultyFilter}
            onDifficultyChange={handleDifficultyChange}
            status={statusFilter}
            onStatusChange={handleStatusChange}
            tags={tags}
            onTagsChange={handleTagsChange}
            availableTags={availableTags}
          />
        
         <div className="divider divider-nuetral"></div>

        {/* Problems Table */}
        <Table
          columns={[
            {
              key: "userStatus",
              label: "Status",
              sortable: false,
              render: (row) => {
                switch (row.userStatus) {
                  case "solved":
                    return (
                      <span className="text-success text-lg" title="Solved">
                        ✓
                      </span>
                    );
                  case "attempted":
                    return (
                      <span className="text-warning text-lg" title="Attempted">
                        ▶
                      </span>
                    );
                  default:
                    return (
                      <span className="opacity-40 text-lg" title="Unsolved">
                        ○
                      </span>
                    );
                }
              },
            },

            { key: "title", label: "Title", sortable: true },
            {
              key: "difficulty",
              label: "Difficulty",
              sortable: true,
              render: (row) => <DifficultyBadge difficulty={row.difficulty} outline={true} />,
            },
            {
              key: "tags",
              label: "Tags",
              sortable: false,
              render: (row) => (
                <div className="flex gap-1 flex-wrap">
                  {row.tags.map((tag) => (
                    <span key={tag} className="badge badge-accent badge-outline text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              ),
            },
            {
              key: "acceptanceRate",
              label: "Acceptance",
              sortable: true,
              render: (row) =>
                row.acceptanceRate !== undefined
                  ? `${row.acceptanceRate}%`
                  : "--",
            },
          ]}
          rowClick={(row) => navigate(`/problems/${row.id}`)}
          rowData={sortedProblems}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          loading={loading}
        />
       </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-slate-700"
              aria-label="Previous page"
            >
              Previous
            </button>

            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                // Show first page, last page, current page, and pages around current
                const showPage =
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1);

                const showEllipsis =
                  (page === 2 && currentPage > 3) ||
                  (page === totalPages - 1 && currentPage < totalPages - 2);

                if (showEllipsis) {
                  return (
                    <span key={page} className="px-2 text-slate-500">
                      ...
                    </span>
                  );
                }

                if (!showPage) return null;

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-md transition-colors ${
                      currentPage === page
                        ? "bg-amber-500 text-white"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                    }`}
                    aria-label={`Page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-slate-700"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        )}

        {/* Page Info */}
        <div className="mt-4 text-center text-sm text-slate-400">
          {totalPages > 1 ? (
            <>
              Page {currentPage} of {totalPages}
            </>
          ) : (
            <>
              Showing {filteredProblems.length}{" "}
              {filteredProblems.length === 1 ? "problem" : "problems"}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProblemList;
