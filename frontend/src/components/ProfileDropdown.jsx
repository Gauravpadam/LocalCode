import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function ProfileDropdown() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="dropdown dropdown-end ">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar placeholder"
      >
        <div className="bg-neutral text-neutral-content rounded-full w-10 flex items-center justify-center">
          <span className="text-xl uppercase font-bold">
            {user?.username?.charAt(0) || "U"}
          </span>
        </div>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu menu-sm z-[100] mt-1 w-52 p-2 shadow-2xl bg-base-200 border border-base-300 rounded-box glass"
      >
        <li>
          <Link to="/dashboard" className="flex justify-between py-3 bg-primary-content">
            Dashboard
            <span className="badge badge-xs badge-primary">New</span>
          </Link>
        </li>
        <div className="divider my-0 opacity-20"></div>
        <li>
          <button
            onClick={handleLogout}
            className="text-error font-medium py-3 hover:bg-error/10"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}

export default ProfileDropdown;
