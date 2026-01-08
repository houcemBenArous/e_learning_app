import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { coursesAPI } from '../../api/courses';
import StarRating from '../../components/StarRating/StarRating';
import './InstructorDashboard.css';

function InstructorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const allCourses = await coursesAPI.getAll();
      const myCourses = allCourses.filter(c => c.instructor?._id === user?.id);
      setCourses(myCourses);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await coursesAPI.create(formData);
      setFormData({ title: '', description: '' });
      setShowCreateForm(false);
      await fetchMyCourses();
      alert('Course created successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create course');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await coursesAPI.delete(courseId);
      await fetchMyCourses();
      alert('Course deleted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete course');
    }
  };

  const totalStudents = courses.reduce((sum, c) => sum + (c.students?.length || 0), 0);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="instructor-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Instructor Dashboard</h1>
          <p>Welcome back, {user?.name}!</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? 'Cancel' : '+ Create Course'}
        </button>
      </div>

      {showCreateForm && (
        <div className="create-form-container">
          <form className="create-form" onSubmit={handleCreateCourse}>
            <h3>Create New Course</h3>
            <div className="form-group">
              <label>Course Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Enter course title"
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter course description"
                rows={4}
              />
            </div>
            <button type="submit" className="btn btn-primary">Create Course</button>
          </form>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">📚</span>
          <div className="stat-info">
            <h3>{courses.length}</h3>
            <p>Total Courses</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">👥</span>
          <div className="stat-info">
            <h3>{totalStudents}</h3>
            <p>Total Students</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⭐</span>
          <div className="stat-info">
            <h3>{user?.instructorRating?.toFixed(1) || '0.0'}</h3>
            <p>Average Rating</p>
          </div>
        </div>
      </div>

      <div className="courses-section">
        <h2>My Courses</h2>
        {courses.length === 0 ? (
          <div className="empty-state">
            <p>You haven't created any courses yet.</p>
          </div>
        ) : (
          <div className="courses-table">
            <table>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Students</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course._id}>
                    <td>
                      <div className="course-cell">
                        <strong>{course.title}</strong>
                        <span>{course.description?.substring(0, 50)}...</span>
                      </div>
                    </td>
                    <td>{course.students?.length || 0}</td>
                    <td>
                      <StarRating 
                        rating={course.averageRating || 0} 
                        showCount={false}
                        size="small"
                      />
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/instructor/courses/${course._id}`} className="btn btn-small btn-secondary">
                          Manage
                        </Link>
                        <button 
                          className="btn btn-small btn-danger"
                          onClick={() => handleDeleteCourse(course._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default InstructorDashboard;