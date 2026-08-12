import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          EventEntrance
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              {user.role === 'organizer' && (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600">
                    Dashboard
                  </Link>
                  <Link to="/create-event" className="text-gray-700 hover:text-indigo-600">
                    Create Event
                  </Link>
                  <Link to="/scan" className="text-gray-700 hover:text-indigo-600">
                    Scan QR
                  </Link>
                </>
              )}
              <Link to="/my-registrations" className="text-gray-700 hover:text-indigo-600">
                My Registrations
              </Link>
              <span className="text-gray-500">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-indigo-600">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;