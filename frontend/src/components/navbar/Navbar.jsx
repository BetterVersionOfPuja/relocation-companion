import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const getInitials = (user) =>
  (user?.fullName || user?.username || "RC")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="nav-shell">
      <Link to="/" className="flex min-w-0 items-center gap-2 focus-visible-ring">
        <div className="brand-mark">
          <span />
        </div>
        <div className="min-w-0">
          <p className="whitespace-nowrap text-sm font-bold tracking-tight text-white md:text-base">
            Relocation Companion
          </p>
        </div>
      </Link>

      {isAuthenticated ? (
        <div className="nav-actions">
          <Link to="/saved-moves" className="nav-link saved-nav-link">
            Saved Moves
          </Link>
          <Link
            to="/profile"
            className="avatar-button"
            aria-label="Open profile"
            title="Profile"
          >
            <span>{getInitials(user)}</span>
          </Link>
        </div>
      ) : (
        <div className="nav-actions">
          <Link to="/login" className="nav-link nav-signin">
            Log In
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
