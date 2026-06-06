import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import UserDropdown from "./UserDropdown";

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const onHome = location.pathname === "/";

  return (
    <nav className="nav-shell mx-auto flex w-full max-w-7xl items-center justify-between gap-5">
      <Link to="/" className="flex min-w-0 items-center gap-3 focus-visible-ring">
        <div className="brand-mark">
          <span />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold tracking-tight text-white">
            Relocation Companion
          </p>
          <p className="hidden text-xs font-semibold text-slate-500 sm:block">
            Intelligence platform
          </p>
        </div>
      </Link>

      <div className="hidden items-center gap-6 text-sm font-semibold text-slate-400 md:flex">
        {isAuthenticated && (
          <a href={onHome ? "#compare" : "/#compare"} className="nav-link">
            Compare
          </a>
        )}
        {onHome && (
          <a href="#results" className="nav-link">
            Insights
          </a>
        )}
        {isAuthenticated && (
          <Link to="/profile" className="nav-link">
            Profile
          </Link>
        )}
      </div>

      {isAuthenticated ? (
        <UserDropdown />
      ) : (
        <div className="nav-actions">
          <Link to="/login" className="nav-link nav-signin">
            Sign In
          </Link>
          <Link to="/register" className="blue-button inline-flex min-h-10 items-center rounded-lg px-4 text-sm font-bold">
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
