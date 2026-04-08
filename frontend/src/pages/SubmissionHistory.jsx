import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../contexts/AuthContext";
import { API_ENDPOINTS } from "../config/api";
import Card from "../components/common/Card";
import Table from "../components/Table";
import StatusBadge from "../components/common/StatusBadge";

/* -------------------- Fake Data -------------------- */
const FAKE_SUBMISSIONS = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  problemTitle: `Problem ${i + 1}`,
  language: i % 2 === 0 ? "javascript" : "python",
  status: i % 3 === 0 ? "accepted" : "wrong_answer",
  runtimeMs: 10 + i,
  memoryKb: 15000 + i * 100,
  submittedAt: new Date(Date.now() - i * 3600000).toISOString(),
}));

/* -------------------- Formatters -------------------- */
const formatStatus = (status) => {
  if (!status) return "Unknown";
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* -------------------- Component -------------------- */
function SubmissionHistory() {
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & sorting
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  /* -------------------- Effects -------------------- */
  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    if (submissions.length === 0) return;
    applyFiltersAndSort();
  }, [submissions, statusFilter, sortBy, sortOrder, applyFiltersAndSort]);

  /* -------------------- Data Fetch -------------------- */
  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);

      if (import.meta.env.VITE_USE_FAKE_SUBMISSIONS === "true") {
        await new Promise((r) => setTimeout(r, 300));
        setSubmissions(FAKE_SUBMISSIONS);
        return;
      }

      const response = await api.get(API_ENDPOINTS.SUBMISSIONS);
      setSubmissions(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load submissions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- Filter + Sort + Format -------------------- */
  const applyFiltersAndSort = () => {
    let data = [...submissions];

    // Filter
    if (statusFilter !== "all") {
      data = data.filter(
        (sub) => sub.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Sort
    data.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "date":
          comparison = new Date(a.submittedAt) - new Date(b.submittedAt);
          break;
        case "runtime":
          comparison = (a.runtimeMs ?? 0) - (b.runtimeMs ?? 0);
          break;
        case "memory":
          comparison = (a.memoryKb ?? 0) - (b.memoryKb ?? 0);
          break;
        case "problemTitle":
          comparison = (a.problemTitle ?? "").localeCompare(
            b.problemTitle ?? ""
          );
          break;
        default:
          comparison = 0;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    // Format once for UI
    const formatted = data.map((sub) => ({
      ...sub,
      status: formatStatus(sub.status),
      date: formatDate(sub.submittedAt),
      runtime:
        sub.runtimeMs != null ? `${sub.runtimeMs} ms` : "-",
      memory:
        sub.memoryKb != null
          ? `${(sub.memoryKb / 1024).toFixed(2)} MB`
          : "-",
    }));

    setFilteredSubmissions(formatted);
    setCurrentPage(1);
  };

  /* -------------------- Sorting Control -------------------- */
  const toggleSortOrder = (columnKey, direction) => {
    setSortBy(columnKey);
    setSortOrder(direction);
  };

  /* -------------------- Pagination -------------------- */
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSubmissions = filteredSubmissions.slice(startIndex, endIndex);

  /* -------------------- States -------------------- */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading submissions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-red-50 p-6">
        <p className="text-red-700">{error}</p>
        <button onClick={fetchSubmissions} className="btn-primary mt-4">
          Retry
        </button>
      </div>
    );
  }

  /* -------------------- Render -------------------- */
  return (
    <section className="px-4 py-10">
      <div className="max-w-7xl mx-auto space-y-6">

        <Card>
          <h1 className="text-3xl font-bold">Submission History</h1>

          <div className="flex gap-4 mt-4">
            {/* Status Filter */}
            <select
              className="select select-bordered select-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="accepted">Accepted</option>
              <option value="wrong_answer">Wrong Answer</option>
              <option value="time_limit_exceeded">Time Limit Exceeded</option>
              <option value="memory_limit_exceeded">
                Memory Limit Exceeded
              </option>
              <option value="runtime_error">Runtime Error</option>
              <option value="compilation_error">Compilation Error</option>
            </select>

            {/* Sort */}
            <select
              className="select select-bordered select-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Date</option>
              <option value="runtime">Runtime</option>
              <option value="memory">Memory</option>
              <option value="problemTitle">Problem</option>
            </select>

            <button
              className="btn btn-sm"
              onClick={() =>
                setSortOrder(sortOrder === "asc" ? "desc" : "asc")
              }
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </Card>

        <Table
          columns={[
            { key: "problemTitle", label: "Problem", sortable: true, },
            { key: "language", label: "Language" },
            { key: "status", label: "Status", render : (row) => <StatusBadge status={row.status} outline /> },
            { key: "runtime", label: "Runtime", sortable: true },
            { key: "memory", label: "Memory", sortable: true },
            { key: "date", label: "Submitted", sortable: true },
          ]}
          rowData={currentSubmissions}
          onSortChange={toggleSortOrder}
          sortBy={sortBy}
          sortOrder={sortOrder}
          rowClick={(row) => navigate(`/submissions/${row.id}`)}
        />

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="btn btn-sm"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="btn btn-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default SubmissionHistory;
