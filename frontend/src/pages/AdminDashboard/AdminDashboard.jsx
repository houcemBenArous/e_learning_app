import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/admin';
import './AdminDashboard.css';

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dashboardData, instructorsData, studentsData] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getAllInstructors(),
        adminAPI.getAllStudents()
      ]);
      setDashboard(dashboardData);
      setInstructors(instructorsData.instructors || []);
      setStudents(studentsData.students || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInstructor = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createInstructor(formData);
      setFormData({ name: '', email: '', password: '' });
      setShowCreateForm(false);
      await fetchData();
      alert('Instructor created successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create instructor');
    }
  };

  const handleDeleteInstructor = async (id) => {
    if (!window.confirm('Delete this instructor and all their courses?')) return;
    try {
      await adminAPI.deleteInstructor(id);
      await fetchData();
      alert('Instructor deleted!');
    } catch (err) {
      alert('Failed to delete instructor');
    }
  };

  if (loading) return <div className="loading">Loading admin dashboard...</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your e-learning platform</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">👨‍🏫</span>
          <div className="stat-info">
            <h3>{dashboard?.statistics?.totalInstructors || 0}</h3>
            <p>Instructors</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">👨‍🎓</span>
          <div className="stat-info">
            <h3>{dashboard?.statistics?.totalStudents || 0}</h3>
            <p>Students</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📚</span>
          <div className="stat-info">
            <h3>{dashboard?.statistics?.totalCourses || 0}</h3>
            <p>Courses</p>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          Overview
        </button>
        <button className={`tab ${activeTab === 'instructors' ? 'active' : ''}`} onClick={() => setActiveTab('instructors')}>
          Instructors
        </button>
        <button className={`tab ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}>
          Students
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="section">
              <h3>Recent Courses</h3>
              <div className="recent-list">
                {dashboard?.recentCourses?.map(course => (
                  <div key={course._id} className="recent-item">
                    <span className="item-title">{course.title}</span>
                    <span className="item-meta">by {course.instructor?.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="section">
              <h3>Recent Instructors</h3>
              <div className="recent-list">
                {dashboard?.recentInstructors?.map(instructor => (
                  <div key={instructor._id} className="recent-item">
                    <span className="item-title">{instructor.name}</span>
                    <span className="item-meta">{instructor.email}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'instructors' && (
          <div>
            <button className="btn btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
              {showCreateForm ? 'Cancel' : '+ Create Instructor'}
            </button>

            {showCreateForm && (
              <form className="create-form" onSubmit={handleCreateInstructor}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">Create</button>
              </form>
            )}

            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Courses</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {instructors.map(instructor => (
                  <tr key={instructor._id}>
                    <td>{instructor.name}</td>
                    <td>{instructor.email}</td>
                    <td>{instructor.coursesCount || 0}</td>
                    <td>
                      <button 
                        className="btn btn-danger btn-small"
                        onClick={() => handleDeleteInstructor(instructor._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'students' && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Enrolled Courses</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.enrolledCoursesCount || 0}</td>
                  <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;