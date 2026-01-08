import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">🎓 E-Learning</Link>
      </div>

      <div className="navbar-links">
        <Link to="/courses">Courses</Link>
        
        {isAuthenticated ? (
          <>
            {/* Student Links */}
            {user.role === 'student' && (
              <Link to="/my-courses">My Courses</Link>
            )}

            {/* Instructor Links */}
            {user.role === 'instructor' && (
              <Link to="/instructor/dashboard">Dashboard</Link>
            )}

            {/* Admin Links */}
            {user.role === 'admin' && (
              <Link to="/admin/dashboard">Admin</Link>
            )}

            <Link to="/profile">Profile</Link>
            
            <div className="navbar-user">
              <span className="user-name">{user.name}</span>
              <span className="user-role">({user.role})</span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </div>
          </>
        ) : (
          <div className="navbar-auth">
            <Link to="/login" className="btn-login">Login</Link>
            <Link to="/register" className="btn-register">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;