import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getStats } from "../services/submissionService";
import { CodingQuote, StatsCard, RecentSubmissions } from "../components/home";
import { Link } from "react-router-dom";
import Card from "../components/common/Card";

const FAKE_HOME_STATS = {
  solvedProblems: 18,
  totalSubmissions: 42,
  accuracy: 73,
  recentSubmissions: [
    {
      id: 1,
      problemTitle: "Two Sum",
      status: "accepted",
      language: "javascript",
      submittedAt: new Date(Date.now() - 10 * 60000).toISOString(),
    },
    {
      id: 2,
      problemTitle: "Reverse Linked List",
      status: "wrong_answer",
      language: "cpp",
      submittedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    },
    {
      id: 3,
      problemTitle: "Binary Tree Inorder Traversal",
      status: "time_limit_exceeded",
      language: "python",
      submittedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
  ],
};

function Home() {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    solved: 0,
    submissions: 0,
    accuracy: "0%",
  });
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated()) {
        setLoading(false);
        return;
      }

      try {
        let statsData;

        if (import.meta.env.VITE_USE_FAKE_HOME_STATS === "true") {
          await new Promise((r) => setTimeout(r, 300));
          statsData = FAKE_HOME_STATS;
        } else {
          statsData = await getStats();
        }

        setStats({
          solved: statsData.solvedProblems || 0,
          submissions: statsData.totalSubmissions || 0,
          accuracy: statsData.accuracy
            ? `${Math.round(statsData.accuracy)}%`
            : "0%",
        });

        setRecentSubmissions(statsData.recentSubmissions || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen ">
      <main className="max-w-7xl mx-auto px-4 py-10 space-y-10">
        {/* Coding Quote */}
        <section className="card card-body bg-base-200 border border-base-300">
          <CodingQuote />
        </section>

        {/* Authenticated View */}
        {isAuthenticated() && (
          <>
            {/* Stats */}
           <div className="group card card-body bg-base-200">
              <section className="stats  bg-base-300/50 border border-base-300 transition-all duration-300 group-hover:border-white stats-vertical lg:stats-horizontal w-full">
              <StatsCard
                title="Problems Solved"
                value={loading ? "—" : stats.solved}
                icon="✓"
                className="text-success"
              />
              <StatsCard
                title="Total Submissions"
                value={loading ? "—" : stats.submissions}
                icon="📝"
                className="text-secondary-content"
              />
              <StatsCard
                title="Accuracy"
                value={loading ? "—" : stats.accuracy}
                icon="🎯"
                className="text-info"
              />
            </section>
           </div>

            {/* Recent Submissions */}
            <section className="">
              <div className="card-body card bg-base-200 border border-base-300">
                <RecentSubmissions
                  submissions={recentSubmissions}
                  loading={loading}
                />
              </div>
            </section>
          </>
        )}

        {/* Guest View */}
        {!isAuthenticated() && (
          <section className="card card-body bg-base-200 border border-base-300">
            <div className="card card-body bg-base-300/50 shadow-xl border border-base-300 items-center text-center gap-6">
              <div className="flex flex-col items-center gap-4 justify-center-safe">
                <h2 className="card-title text-2xl">Welcome to LocalCode</h2>

                <p className="">
                  Practice coding problems in your self-hosted environment
                </p>
              </div>
              <div className="card-actions">
                <Link to="/register">
                  <button className="btn btn-primary">Get Started</button>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default Home;
