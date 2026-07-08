import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <Link to="/" className="font-semibold text-brand-700">
          Weekly Reports
        </Link>

        {user && (
          <div className="flex items-center gap-4 text-sm">
            <Link to="/my-reports" className="text-gray-600 hover:text-brand-600">
              My Reports
            </Link>
            {user.role === 'manager' && (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-brand-600">
                  Team Dashboard
                </Link>
                <Link to="/projects" className="text-gray-600 hover:text-brand-600">
                  Projects
                </Link>
              </>
            )}
            <span className="text-gray-400">|</span>
            <span className="text-gray-700">
              {user.name} <span className="text-xs text-gray-400">({user.role})</span>
            </span>
            <button
              onClick={handleLogout}
              className="bg-gray-100 hover:bg-gray-200 rounded-md px-3 py-1.5"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
