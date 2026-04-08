import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../contexts/AuthContext";
import { API_ENDPOINTS } from "../config/api";
import Card from "../components/common/Card";
import StatusBadge from "../components/common/StatusBadge";
import Table from "../components/Table";

const FAKE_STATS = { totalSolved: 42, totalAttempted: 65, totalProblems: 120 };

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      if (import.meta.env.VITE_USE_FAKE_DASHBOARD === "true") {
        await new Promise((r) => setTimeout(r, 600));
        setStats(FAKE_STATS);
        setRecentSubmissions([
          {
            id: 1,
            problemTitle: "Two Sum",
            language: "javascript",
            status: "accepted",
            runtimeMs: 12,
            submittedAt: new Date(Date.now() - 5 * 60000).toISOString(),
          },
          {
            id: 2,
            problemTitle: "Reverse Linked List",
            language: "cpp",
            status: "wrong_answer",
            runtimeMs: 48,
            submittedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
          },
          {
            id: 3,
            problemTitle: "Binary Tree Inorder Traversal",
            language: "python",
            status: "time_limit_exceeded",
            runtimeMs: null,
            submittedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
          },
        ]);
        return;
      }
      const [statsRes, subRes] = await Promise.all([
        api.get(API_ENDPOINTS.SUBMISSION_STATS),
        api.get(API_ENDPOINTS.SUBMISSIONS),
      ]);
      setStats(statsRes.data);
      setRecentSubmissions(subRes.data.slice(0, 5));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const diffMins = Math.floor((new Date() - new Date(dateString)) / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4 px-4 py-10">
        <span className="loading loading-ring loading-lg text-primary"></span>
        <p className="text-base-content/60 animate-pulse">
          Assembling your progress...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
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
            onClick={fetchDashboardData}
            className="btn btn-sm btn-ghost bg-black/10"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="px-4 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 card-body bg-base-200 border-l card  border border-base-300">
        <header
          className="
  flex flex-col md:flex-row md:items-end justify-between gap-4
  card card-body
  bg-base-300/50
  border border-base-300
"
        >
          <div>
            <h1 className="text-4xl font-bold text-base-content">Dashboard</h1>
            <p className="text-base-content/60 mt-1">
              Welcome back to your coding journey.
            </p>
          </div>
        </header>

        {/* Statistics Section using daisyUI Stats */}
        <div className="stats stats-vertical lg:stats-horizontal shadow-xl bg-base-300/50 border border-base-300 w-full">
          <div className="stat">
            <div className="stat-figure text-success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <div className="stat-title">Total Solved</div>
            <div className="stat-value text-success">
              {stats?.totalSolved || 0}
            </div>
            <div className="stat-desc">Problems completed successfully</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary-content">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                ></path>
              </svg>
            </div>
            <div className="stat-title">Attempted</div>
            <div className="stat-value text-secondary-content">
              {stats?.totalAttempted || 0}
            </div>
            <div className="stat-desc">Working on it...</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-primary-content">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div className="stat-title">Platform Total</div>
            <div className="stat-value text-primary-content">
              {stats?.totalProblems || 0}
            </div>
            <div className="stat-desc">Available challenges</div>
          </div>
        </div>

        {/* Quick Links with daisyUI Buttons/Cards */}
        <section className="bg-base-300/50 border border-base-300 card card-body">
          <h2 className="text-2xl font-bold mb-4 px-1 text-base-content">
            Training Grounds
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: "Easy",
                desc: "Warm up your brain",
                colorClass:
                  "border-success/30 hover:border-success text-success bg-success/5",
                path: "/problems?difficulty=easy",
              },
              {
                label: "Medium",
                desc: "Push your limits",
                colorClass:
                  "border-warning/30 hover:border-warning text-warning bg-warning/5",
                path: "/problems?difficulty=medium",
              },
              {
                label: "Hard",
                desc: "Master the craft",
                colorClass:
                  "border-error/30 hover:border-error text-error bg-error/5",
                path: "/problems?difficulty=hard",
              },
            ].map((lvl) => (
              <button
                key={lvl.label}
                onClick={() => navigate(lvl.path)}
                className={`group cursor-pointer flex flex-col items-start p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${lvl.colorClass}`}
              >
                <span className="text-2xl font-black tracking-tight uppercase">
                  {lvl.label}
                </span>
                <span className="text-sm font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                  {lvl.desc}
                </span>

                {/* Subtle Arrow Indicator */}
                <div className="mt-4 flex items-center gap-1 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                  Solve Now <span>→</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <Card className="p-0 border border-base-300">
          {/* Header */}
          <div className="p-6 border-b border-base-300 flex justify-between items-center">
            <h2 className="text-xl font-bold text-base-content">
              Recent Activity
            </h2>
            <Link to="/submissions" className="btn btn-primary btn-sm">
              View All →
            </Link>
          </div>

          {/* Table */}
          <Table
          columns={[
            { key: "problemTitle", label: "Problem" },
            {
              key: "language",
              label: "Language",
              render: (row) => (
                <code className="text-xs bg-base-200 px-2 py-1 rounded">
                  {row.language}
                </code>
              ),
            },
            {
              key: "status",
              label: "Status",
              render: (row) => <StatusBadge status={row.status} outline />,
            },
            {
              key: "runtimeMs",
              label: "Runtime",
              render: (row) => (row.runtimeMs ? `${row.runtimeMs}ms` : "--"),
            },
            {
              key: "submittedAt",
              label: "Submitted",
              render: (row) => formatDate(row.submittedAt),
            },
          ]}
          rowData={recentSubmissions}
          rowClick={(row) => navigate(`/submissions/${row.id}`)}
        />
        </Card>
        
      </div>
    </main>
  );
}

export default Dashboard;
