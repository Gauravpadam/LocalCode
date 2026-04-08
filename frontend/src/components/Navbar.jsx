// ### Navbar (DaisyUI)
// - Converted from custom Tailwind layout to DaisyUI `navbar`
// - Removed hardcoded colors in favor of theme tokens
// - Authentication UI delegated to `ProfileDropdown`


import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "./common/Button";
import ProfileDropdown from "./ProfileDropdown";


function Navbar() {
  const { isAuthenticated } = useAuth();

  

  return (
    <nav className="navbar bg-base-100/50 border-b-2 border-base-300 p-4 sm:p-6">
      {/* Navbar Start: Logo */}
      <div className="navbar-start">
        <Link
          to="/"
          className="text-xl font-bold text-primary-content hover:opacity-80 transition-opacity"
        >
          LocalCode
        </Link>
      </div>

      {/* Navbar Center: Links (Hidden on mobile, visible on desktop) */}
      <div className="navbar-center hidden lg:flex ">
        {isAuthenticated() && (
          <ul className="menu menu-horizontal px-1 gap-2">
            <li>
              <Link to="/problems" className="text-sm font-medium z-10 text-secondary-content ">
                Problems
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="text-sm font-medium text-secondary-content ">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/submissions" className="text-sm font-medium text-secondary-content ">
                Submissions
              </Link>
            </li>
          </ul>
        )}
      </div>

      {/* Navbar End: Auth Buttons & User Info */}
      <div className="navbar-end">
        {isAuthenticated() ? (
          
          <ProfileDropdown/>
           
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="btn btn-ghost btn-sm text-sm font-medium"
            >
              Login
            </Link>
            <Link to="/register">
              <Button variant="primary" className="btn-sm">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;