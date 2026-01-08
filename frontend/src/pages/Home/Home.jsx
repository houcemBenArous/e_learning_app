import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <h1>Welcome to E-Learning Platform</h1>
        <p>Learn new skills from expert instructors</p>
        
        {!isAuthenticated ? (
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">Get Started</Link>
            <Link to="/courses" className="btn btn-secondary">Browse Courses</Link>
          </div>
        ) : (
          <div className="hero-buttons">
            <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
            {user.role === 'student' && (
              <Link to="/my-courses" className="btn btn-secondary">My Courses</Link>
            )}
            {user.role === 'instructor' && (
              <Link to="/instructor/dashboard" className="btn btn-secondary">My Dashboard</Link>
            )}
            {user.role === 'admin' && (
              <Link to="/admin/dashboard" className="btn btn-secondary">Admin Dashboard</Link>
            )}
          </div>
        )}
      </section>

      <section className="features">
        <div className="feature-card">
          <span className="feature-icon">📚</span>
          <h3>Quality Courses</h3>
          <p>Learn from carefully crafted courses by expert instructors</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🎯</span>
          <h3>Interactive Quizzes</h3>
          <p>Test your knowledge with quizzes after each lesson</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">⭐</span>
          <h3>Rate & Review</h3>
          <p>Share your feedback and help others find great courses</p>
        </div>
      </section>
    </div>
  );
}

export default Home;