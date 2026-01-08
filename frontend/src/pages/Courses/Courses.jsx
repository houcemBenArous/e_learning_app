import { useState, useEffect } from 'react';
import { coursesAPI } from '../../api/courses';
import CourseCard from '../../components/CourseCard/CourseCard';
import './Courses.css';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await coursesAPI.getAll();
      setCourses(data);
    } catch (err) {
      setError('Failed to load courses. Please try again later.');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter courses based on search term
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="courses-page">
        <div className="loading">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="courses-page">
      <div className="courses-header">
        <h1>Browse Courses</h1>
        <p>Discover courses from expert instructors</p>
        
        <div className="search-box">
          <input
            type="text"
            placeholder="Search courses by title, description, or instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="courses-stats">
        <span>{filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found</span>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="no-courses">
          <span className="no-courses-icon">📭</span>
          <h3>No courses found</h3>
          <p>
            {searchTerm 
              ? 'Try adjusting your search terms' 
              : 'No courses available at the moment'}
          </p>
        </div>
      ) : (
        <div className="courses-grid">
          {filteredCourses.map(course => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Courses;