import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { coursesAPI } from '../../api/courses';
import StarRating from '../../components/StarRating/StarRating';
import './MyCourses.css';

function MyCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const allCourses = await coursesAPI.getAll();
      const enrolled = allCourses.filter(course => 
        course.students?.some(s => s === user?.id || s._id === user?.id)
      );
      setCourses(enrolled);
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading your courses...</div>;

  return (
    <div className="my-courses-page">
      <div className="page-header">
        <h1>My Courses</h1>
        <p>Continue learning from where you left off</p>
      </div>

      {courses.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📚</span>
          <h3>No courses yet</h3>
          <p>You haven't enrolled in any courses yet.</p>
          <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map(course => (
            <div key={course._id} className="enrolled-course-card">
              <div className="course-icon">📚</div>
              <div className="course-info">
                <h3>{course.title}</h3>
                <p className="instructor">By {course.instructor?.name}</p>
                <StarRating 
                  rating={course.averageRating || 0} 
                  totalReviews={course.totalReviews || 0}
                  size="small"
                />
              </div>
              <Link to={`/courses/${course._id}`} className="btn btn-primary">
                Continue Learning
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyCourses;